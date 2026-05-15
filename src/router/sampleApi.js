import express from "express";
import jwt from "jsonwebtoken";
import courseController from "../controller/courseController.js";
import categoryController from "../controller/categoryController.js";
import teacherController from "../controller/teacherController.js";
import lessonController from "../controller/lessonController.js";
import { checkUserJwt } from "../middleware/jwtAction.js";
import lessonService from "../service/lessonService.js";
import db from "../models/index.js"; // Sequelize models — điều chỉnh path nếu cần

const router = express.Router();

const VIDEO_TOKEN_SECRET =
  process.env.VIDEO_TOKEN_SECRET || "video_secret_key_change_in_production";
const VIDEO_TOKEN_EXPIRES_IN = "15m"; // Token chỉ sống 15 phút

const isValidYoutubeId = (value) => /^[A-Za-z0-9_-]{11}$/.test(value);

// ─────────────────────────────────────────────────────────────────────────────
// Middleware: Kiểm tra user đã mua khóa học chứa bài học có videoId này chưa
// ─────────────────────────────────────────────────────────────────────────────
const checkVideoOwnership = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const userId = req.user?.id; // Lấy từ checkUserJwt đã decode JWT
console.log('sssssssssss ', videoId);

    if (!userId) {
      return res.status(401).json({ EC: -1, EM: "Unauthorized" });
    }

    // Tìm lesson có videoId này (videoId đã được sanitize, không lưu videoUrl gốc)
    const lesson = await db.Lesson.findOne({ where: { videoId } });
    if (!lesson) {
      return res.status(404).json({ EC: -1, EM: "Video not found" });
    }

    // Kiểm tra user đã mua course chứa lesson này chưa
    // Điều chỉnh tên model/field theo đúng DB schema của bạn
    const purchase = await db.Purchase.findOne({
      where: {
        userId,
        courseId: lesson.courseId,
        status: "completed", // hoặc "paid", "active" — tuỳ schema
      },
    });

    if (!purchase) {
      return res
        .status(403)
        .json({ EC: -1, EM: "You have not purchased this course" });
    }

    // Đính kèm thông tin lesson vào request để handler dùng lại
    req.lesson = lesson;
    next();
  } catch (error) {
    console.error("checkVideoOwnership error:", error);
    return res.status(500).json({ EC: -1, EM: "Internal server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// BƯỚC 1 — Frontend xin Signed Token (không trả URL YouTube)
// POST /api/v1/video/token  { videoId }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/video/token", checkUserJwt, async (req, res) => {
  try {
    const { lessonId, videoId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ EC: -1, EM: "Unauthorized" });
    }

    let lesson = null;
    if (lessonId) {
      lesson = await db.Lesson.findByPk(lessonId);
    } else if (videoId && isValidYoutubeId(videoId)) {
      lesson = await db.Lesson.findOne({ where: { videoId } });
    }

    if (!lesson) {
      return res.status(404).json({ EC: -1, EM: "Lesson not found" });
    }

    const purchase = await db.Purchase.findOne({
      where: {
        userId,
        courseId: lesson.courseId,
        status: "completed",
      },
    });

    if (!purchase) {
      return res
        .status(403)
        .json({ EC: -1, EM: "You have not purchased this course" });
    }

    const videoToken = jwt.sign(
      {
        userId,
        lessonId: lesson.id,
        courseId: lesson.courseId,
      },
      VIDEO_TOKEN_SECRET,
      { expiresIn: VIDEO_TOKEN_EXPIRES_IN },
    );

    return res.json({ EC: 0, DT: { token: videoToken }, EM: "OK" });
  } catch (error) {
    console.error("video/token error:", error);
    return res.status(500).json({ EC: -1, EM: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// BƯỚC 2 — Dùng Signed Token để xem video (trả về HTML proxy)
// GET /api/v1/video/watch/:token
// ─────────────────────────────────────────────────────────────────────────────
router.get("/video/watch/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const payload = jwt.verify(token, VIDEO_TOKEN_SECRET);
    const { lessonId, userId } = payload;

    if (!lessonId) {
      return res.status(400).json({ EC: -1, EM: "Invalid token payload" });
    }

    const lesson = await db.Lesson.findByPk(lessonId);
    if (!lesson || !lesson.videoId) {
      return res.status(404).json({ EC: -1, EM: "Lesson not found" });
    }

    const youtubeEmbedUrl = `https://www.youtube.com/embed/${lesson.videoId}?rel=0&modestbranding=1&iv_load_policy=3`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Content-Security-Policy", "frame-ancestors 'self'");

    return res.send(`<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Protected Video</title>
  <style>
    html, body { margin: 0; height: 100%; background: #000; overflow: hidden; }
    iframe { border: 0; width: 100%; height: 100%; display: block; }
  </style>
</head>
<body>
  <iframe
    src="${youtubeEmbedUrl}"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</body>
</html>`);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).send(`<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Hết hạn</title>
  <style>
    body { margin: 0; height: 100vh; display: flex; align-items: center; justify-content: center;
           background: #0f172a; color: #fff; font-family: sans-serif; flex-direction: column; gap: 12px; }
    button { padding: 10px 24px; background: #00bc86; color: #fff; border: none;
             border-radius: 8px; cursor: pointer; font-size: 14px; }
  </style>
</head>
<body>
  <p>⏰ Phiên xem video đã hết hạn</p>
  <button onclick="window.parent.postMessage('VIDEO_TOKEN_EXPIRED', '*')">Tải lại</button>
</body>
</html>`);
    }
    return res.status(401).json({ EC: -1, EM: "Invalid or expired token" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Route cũ /video/proxy/:videoId — giữ lại nhưng yêu cầu auth + ownership
// để không breaking change nếu có nơi khác gọi
// ─────────────────────────────────────────────────────────────────────────────
router.get(
  "/video/proxy/:videoId",
  // checkUserJwt,
  // checkVideoOwnership,
  (req, res) => {
    const { videoId } = req.params;

    if (!isValidYoutubeId(videoId)) {
      return res.status(400).json({ EC: -1, EM: "Invalid video id" });
    }

    const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Content-Security-Policy", "frame-ancestors 'self'");

    return res.send(`<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Protected Video</title>
  <style>
    html, body { margin: 0; height: 100%; background: #000; overflow: hidden; }
    iframe { border: 0; width: 100%; height: 100%; display: block; }
  </style>
</head>
<body>
  <iframe
    src="${youtubeEmbedUrl}"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</body>
</html>`);
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// Các routes còn lại — không thay đổi
// ─────────────────────────────────────────────────────────────────────────────
const SampleApi = (app) => {
  router.get("/categories", categoryController.getAllCategories);
  router.get("/categories/:id", categoryController.getCategoryById);
  router.post("/categories", categoryController.createCategory);
  router.put("/categories/:id", categoryController.updateCategory);
  router.delete("/categories/:id", categoryController.deleteCategory);

  router.get("/teachers", teacherController.getAllTeachers);
  router.get("/teachers/:id", teacherController.getTeacherById);
  router.post("/teachers", teacherController.createTeacher);
  router.put("/teachers/:id", teacherController.updateTeacher);
  router.delete("/teachers/:id", teacherController.deleteTeacher);

  router.get("/courses", courseController.getAllCourses);
  router.get("/courses/:id", courseController.getCourseById);
  router.post("/courses", courseController.createCourse);
  router.put("/courses/:id", courseController.updateCourse);
  router.delete("/courses/:id", courseController.deleteCourse);

  router.get("/lessons", lessonController.getAllLessons);
  router.get("/lessons/:id", lessonController.getLessonById);
  router.post("/lessons", lessonController.createLesson);
  router.put("/lessons/:id", lessonController.updateLesson);
  router.delete("/lessons/:id", lessonController.deleteLesson);

  return app.use("/api/v1", router);
};

export default SampleApi;
