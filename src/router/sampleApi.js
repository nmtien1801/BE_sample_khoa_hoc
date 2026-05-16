import express from "express";
import jwt from "jsonwebtoken";
import courseController from "../controller/courseController.js";
import categoryController from "../controller/categoryController.js";
import teacherController from "../controller/teacherController.js";
import lessonController from "../controller/lessonController.js";
import { checkUserJwt } from "../middleware/jwtAction.js";
import db from "../models/index.js";

const router = express.Router();

const VIDEO_TOKEN_SECRET =
  process.env.VIDEO_TOKEN_SECRET || "video_secret_key_change_in_production";

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Extract YouTube ID từ videoUrl (chạy hoàn toàn trên server)
// YouTube ID luôn đúng 11 ký tự [A-Za-z0-9_-]
// ─────────────────────────────────────────────────────────────────────────────
const extractYoutubeId = (url) => {
  if (!url) return null;
  const match = url.match(
    /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]{11}).*/,
  );
  return match ? match[1] : null;
};

const isValidYoutubeId = (id) => /^[A-Za-z0-9_-]{11}$/.test(id ?? "");

// ─────────────────────────────────────────────────────────────────────────────
// BƯỚC 1 — Frontend xin Signed Token
// POST /api/v1/video/token   Body: { lessonId }
//
// Flow:
//  1. Xác thực JWT user (checkUserJwt)
//  2. Tìm lesson theo lessonId
//  3. Kiểm tra user đã mua course chứa lesson đó chưa (bảng Purchase)
//  4. Ký token ngắn hạn 15 phút — payload chỉ chứa lessonId + userId
//     (tuyệt đối KHÔNG đưa videoUrl hay YouTube ID vào token)
//  5. Trả token về Frontend
// ─────────────────────────────────────────────────────────────────────────────
router.post("/video/token", checkUserJwt, async (req, res) => {
  try {
    const { lessonId } = req.body;
    const userId = req.user?.id;

    if (!lessonId) {
      return res.status(500).json({ EC: -1, EM: "Thiếu lessonId" });
    }

    // 1. Tìm lesson — chỉ lấy field cần thiết, không select videoUrl ra ngoài scope này
    const lesson = await db.Lesson.findByPk(lessonId, {
      attributes: ["id", "courseId", "videoUrl"],
    });

    if (!lesson) {
      return res.status(500).json({ EC: -1, EM: "Không tìm thấy bài học" });
    }

    // Kiểm tra lesson có video không trước khi cấp token
    if (!lesson.videoUrl) {
      return res.status(500).json({ EC: -1, EM: "Bài học này chưa có video" });
    }

    // 2. Kiểm tra user đã mua khóa học chưa — dùng `Order`/`Payment`
    let hasPurchased = false;

    // Kiểm tra Orders (Order.courseId tương ứng courseId)
    if (db.Order) {
      const order = await db.Order.findOne({
        where: {
          userId,
          courseId: lesson.courseId,
          status: "completed",
        },
      });
      if (order) hasPurchased = true;
    }

    // Nếu chưa có Order thành công, kiểm tra Payment liên quan (status success) và liên kết Order
    if (!hasPurchased && db.Payment && db.Order) {
      const payment = await db.Payment.findOne({
        where: { status: "success" },
        include: [
          {
            model: db.Order,
            as: "order",
            where: { userId, courseId: lesson.courseId },
            attributes: ["orderId", "courseId"],
          },
        ],
      });
      if (payment) hasPurchased = true;
    }

    if (!hasPurchased) {
      return res.status(500).json({ EC: -1, EM: "Bạn chưa mua khóa học này" });
    }

    // 3. Ký token — payload gọn, KHÔNG chứa URL video
    const videoToken = jwt.sign(
      { userId, lessonId: lesson.id },
      VIDEO_TOKEN_SECRET,
      { expiresIn: "15m" },
    );

    return res.json({ EC: 0, DT: { token: videoToken }, EM: "OK" });
  } catch (error) {
    console.error("POST /video/token error:", error);
    return res.status(500).json({ EC: -1, EM: "Lỗi Server" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// BƯỚC 2 — Phát video bằng Signed Token
// GET /api/v1/video/watch/:token
//
// Flow:
//  1. Verify JWT token (hết hạn → trả trang thông báo có nút reload)
//  2. Lấy lessonId từ payload → tra DB → đọc videoUrl (bí mật, không ra ngoài)
//  3. Extract YouTube ID trên server
//  4. Trả HTML proxy nhúng iframe — Frontend chỉ thấy URL /video/watch/...
//     KHÔNG BAO GIỜ thấy YouTube ID hay videoUrl thật
// ─────────────────────────────────────────────────────────────────────────────
router.get("/video/watch/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // 1. Verify token
    const payload = jwt.verify(token, VIDEO_TOKEN_SECRET);
    const { lessonId } = payload;

    // 2. Tra DB lấy videoUrl — chỉ select field cần thiết
    const lesson = await db.Lesson.findByPk(lessonId, {
      attributes: ["videoUrl"],
    });

    if (!lesson?.videoUrl) {
      return res
        .status(500)
        .send(renderErrorHtml("Không tìm thấy video bài học này."));
    }

    // 3. Extract YouTube ID hoàn toàn trên server
    const youtubeId = extractYoutubeId(lesson.videoUrl);

    if (!youtubeId || !isValidYoutubeId(youtubeId)) {
      return res
        .status(422)
        .send(
          renderErrorHtml("Link video không hợp lệ. Vui lòng liên hệ hỗ trợ."),
        );
    }

    // SỬA TẠI BACKEND: Thêm tham số controls, modestbranding, rel và tinh chỉnh để ẩn nút thừa
    const embedUrl =
      `https://www.youtube.com/embed/${youtubeId}?` +
      new URLSearchParams({
        autoplay: "1",
        controls: "1",
        rel: "0", // ẩn video liên quan
        modestbranding: "1", // giảm logo YouTube
        iv_load_policy: "3", // tắt annotations
        showinfo: "0", // ẩn title (deprecated nhưng vẫn có tác dụng)
        fs: "0", // ẩn nút fullscreen
        disablekb: "1", // tắt keyboard shortcuts
        cc_load_policy: "0", // tắt subtitles mặc định
      }).toString();

    // 4. Trả HTML — YouTube ID chỉ tồn tại trong server-side response này
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader(
      "Content-Security-Policy",
      "frame-ancestors 'self' http://localhost:5173",
    );

    return res.send(`<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Protected Video</title>
 <style>
  html, body { margin: 0; height: 100%; background: #000; overflow: hidden; position: relative; }
  iframe { border: 0; width: 100%; height: 100%; display: block; }
  /* Che nút Share và Watch Later góc dưới trái */
  .overlay-bl {
    position: absolute;
    bottom: 0; left: 0;
    width: 160px; height: 60px;
    background: #000;
    z-index: 10;
  }
  /* Che nút "Video khác" + logo YouTube góc dưới phải */
  .overlay-br {
    position: absolute;
    bottom: 0; right: 0;
    width: 330px; height: 60px;
    background: #000;
    z-index: 10;
  }
</style>
</head>
<body>
  <div class="overlay-bl"></div>
  <div class="overlay-br"></div>
  <iframe
    src="${embedUrl}"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</body>
</html>`);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).send(renderExpiredHtml());
    }
    console.error("GET /video/watch error:", error);
    return res
      .status(401)
      .send(renderErrorHtml("Phiên xem không hợp lệ hoặc đã hết hạn."));
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// HTML helpers
// ─────────────────────────────────────────────────────────────────────────────
function renderExpiredHtml() {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Hết hạn phiên</title>
  <style>
    body {
      margin: 0; height: 100vh;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 16px;
      background: #0f172a; color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    p { margin: 0; font-size: 15px; color: #94a3b8; }
    button {
      padding: 10px 28px; background: #00bc86; color: #fff;
      border: none; border-radius: 10px; cursor: pointer;
      font-size: 14px; font-weight: 700;
    }
    button:hover { background: #00a876; }
  </style>
</head>
<body>
  <svg width="48" height="48" fill="none" stroke="#f59e0b" stroke-width="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
  <p>⏰ Phiên xem video đã hết hạn (15 phút)</p>
  <button onclick="window.parent.postMessage('VIDEO_TOKEN_EXPIRED', '*')">
    Tải lại video
  </button>
</body>
</html>`;
}

function renderErrorHtml(message = "Đã xảy ra lỗi.") {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Lỗi</title>
  <style>
    body {
      margin: 0; height: 100vh;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 12px;
      background: #0f172a; color: #94a3b8;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 14px; text-align: center; padding: 24px;
    }
  </style>
</head>
<body>
  <svg width="40" height="40" fill="none" stroke="#ef4444" stroke-width="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
  </svg>
  <p>${message}</p>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Các routes nghiệp vụ — không thay đổi
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
  router.get("/courseByUser/:userId", courseController.getCoursesByUserId);
  router.get("/courses/:id", courseController.getCourseById);
  router.post("/courses", courseController.createCourse);
  router.put("/courses/:id", courseController.updateCourse);
  router.delete("/courses/:id", courseController.deleteCourse);
  router.get("/admin/courses", courseController.getAllAdminCourses);

  router.get("/lessons", lessonController.getAllLessons);
  router.get("/lessons/:id", lessonController.getLessonById);
  router.post("/lessons", lessonController.createLesson);
  router.put("/lessons/:id", lessonController.updateLesson);
  router.delete("/lessons/:id", lessonController.deleteLesson);
  router.get("/admin/lessons", lessonController.getAllAdminLessons);

  return app.use("/api/v1", router);
};

export default SampleApi;
