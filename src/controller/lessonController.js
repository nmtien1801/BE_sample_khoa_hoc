import lessonService from "../service/lessonService.js";

const sanitizeLessonData = (lesson, isAdmin = false) => {
  if (!lesson) return lesson;
  const plain = lesson.get ? lesson.get({ plain: true }) : { ...lesson };
  if (isAdmin) return plain;

  const { videoId, videoUrl, ...safelesson } = plain;
  return safelesson;
};

const getAllLessons = async (req, res) => {
  try {
    const filters = {
      courseId: req.query.courseId,
      title: req.query.title,
    };
    const lessons = await lessonService.getAllLessons(filters);
    const sanitizedLessons = lessons.map((lesson) => sanitizeLessonData(lesson, req.user?.role === "admin"));
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
    res.json({ data: sanitizeLessonData(lesson, req.user?.role === "admin") });
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

export default {
  getAllLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
};
