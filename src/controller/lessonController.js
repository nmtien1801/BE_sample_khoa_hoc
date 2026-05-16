import lessonService from "../service/lessonService.js";

// ─────────────────────────────────────────────────────────────────────────────
// Bảo mật: Xoá hoàn toàn videoUrl khỏi mọi response trả về Frontend.
// Frontend dùng lessonId để xin Signed Token qua POST /api/v1/video/token.
// ─────────────────────────────────────────────────────────────────────────────
const sanitizeLessonData = (lesson) => {
  if (!lesson) return lesson;
  const plain = lesson.get ? lesson.get({ plain: true }) : { ...lesson };
  // Xoá videoUrl — không để lộ link YouTube dưới bất kỳ hình thức nào
  const { videoUrl, ...safeLesson } = plain;
  return safeLesson;
};

const getAllLessons = async (req, res) => {
  try {
    const filters = {
      courseId: req.query.courseId,
      title: req.query.title,
    };
    const lessons = await lessonService.getAllLessons(filters);
    const sanitizedLessons = lessons.map(sanitizeLessonData);
    res.json({ data: sanitizedLessons, total: sanitizedLessons.length });
  } catch (error) {
    console.error("lessonController getAllLessons", error);
    res.status(500).json({ message: "Internal server error", error, data: [] });
  }
};

const getLessonById = async (req, res) => {
  try {
    const lesson = await lessonService.getLessonById(req.params.id);
    if (!lesson)
      return res.status(404).json({ message: "Lesson not found", data: null });
    res.json({ data: sanitizeLessonData(lesson) });
  } catch (error) {
    console.error("lessonController getLessonById", error);
    res.status(500).json({ message: "Internal server error", data: null });
  }
};

const createLesson = async (req, res) => {
  try {
    const lesson = await lessonService.createLesson(req.body);
    res.status(201).json({ message: "Lesson created", data: lesson });
  } catch (error) {
    console.error("lessonController createLesson", error);
    res.status(500).json({ message: "Internal server error", data: null });
  }
};

const updateLesson = async (req, res) => {
  try {
    const updated = await lessonService.updateLesson(req.params.id, req.body);
    if (!updated)
      return res.status(404).json({ message: "Lesson not found", data: null });
    res.json({ message: "Lesson updated", data: updated });
  } catch (error) {
    console.error("lessonController updateLesson", error);
    res.status(500).json({ message: "Internal server error", data: null });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const removed = await lessonService.deleteLesson(req.params.id);
    if (!removed)
      return res.status(404).json({ message: "Lesson not found", data: null });
    res.json({ message: "Lesson deleted", data: removed });
  } catch (error) {
    console.error("lessonController deleteLesson", error);
    res.status(500).json({ message: "Internal server error", data: null });
  }
};

const getAllAdminLessons = async (req, res) => {
  try {
    const filters = {
      courseId: req.query.courseId,
      title: req.query.title,
    };
    const lessons = await lessonService.getAllAdminLessons(filters);
    res.json({ data: lessons, total: lessons.length });
  } catch (error) {
    console.error("lessonController getAllAdminLessons", error);
    res.status(500).json({ message: "Internal server error", error, data: [] });
  }
};

export default {
  getAllLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  getAllAdminLessons,
};
