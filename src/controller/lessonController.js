import lessonService from "../service/lessonService.js";

const getAllLessons = async (req, res) => {
  try {
    const lessons = await lessonService.getAllLessons();
    res.json({ EM: "OK", EC: 0, DT: lessons });
  } catch (error) {
    console.error("lessonController getAllLessons", error);
    res.status(500).json({ EM: "Internal server error", EC: -1, DT: [] });
  }
};

const getLessonById = async (req, res) => {
  try {
    const lesson = await lessonService.getLessonById(req.params.id);
    if (!lesson)
      return res.status(404).json({ EM: "Lesson not found", EC: 1, DT: null });
    res.json({ EM: "OK", EC: 0, DT: lesson });
  } catch (error) {
    console.error("lessonController getLessonById", error);
    res.status(500).json({ EM: "Internal server error", EC: -1, DT: null });
  }
};

const createLesson = async (req, res) => {
  try {
    const lesson = await lessonService.createLesson(req.body);
    res.status(201).json({ EM: "Lesson created", EC: 0, DT: lesson });
  } catch (error) {
    console.error("lessonController createLesson", error);
    res.status(500).json({ EM: "Internal server error", EC: -1, DT: null });
  }
};

const updateLesson = async (req, res) => {
  try {
    const updated = await lessonService.updateLesson(req.params.id, req.body);
    if (!updated)
      return res.status(404).json({ EM: "Lesson not found", EC: 1, DT: null });
    res.json({ EM: "Lesson updated", EC: 0, DT: updated });
  } catch (error) {
    console.error("lessonController updateLesson", error);
    res.status(500).json({ EM: "Internal server error", EC: -1, DT: null });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const removed = await lessonService.deleteLesson(req.params.id);
    if (!removed)
      return res.status(404).json({ EM: "Lesson not found", EC: 1, DT: null });
    res.json({ EM: "Lesson deleted", EC: 0, DT: removed });
  } catch (error) {
    console.error("lessonController deleteLesson", error);
    res.status(500).json({ EM: "Internal server error", EC: -1, DT: null });
  }
};

export default {
  getAllLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
};
