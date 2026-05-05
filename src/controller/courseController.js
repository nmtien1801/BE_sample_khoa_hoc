import courseService from "../service/courseService.js";

const getAllCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    res.json({ EM: "OK", EC: 0, DT: courses });
  } catch (error) {
    console.error("courseController getAllCourses", error);
    res.status(500).json({ EM: "Internal server error", EC: -1, DT: [] });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course)
      return res.status(404).json({ EM: "Course not found", EC: 1, DT: null });
    res.json({ EM: "OK", EC: 0, DT: course });
  } catch (error) {
    console.error("courseController getCourseById", error);
    res.status(500).json({ EM: "Internal server error", EC: -1, DT: null });
  }
};

const createCourse = async (req, res) => {
  try {
    const newCourse = await courseService.createCourse(req.body);
    res.status(201).json({ EM: "Course created", EC: 0, DT: newCourse });
  } catch (error) {
    console.error("courseController createCourse", error);
    res.status(500).json({ EM: "Internal server error", EC: -1, DT: null });
  }
};

const updateCourse = async (req, res) => {
  try {
    const updated = await courseService.updateCourse(req.params.id, req.body);
    if (!updated)
      return res.status(404).json({ EM: "Course not found", EC: 1, DT: null });
    res.json({ EM: "Course updated", EC: 0, DT: updated });
  } catch (error) {
    console.error("courseController updateCourse", error);
    res.status(500).json({ EM: "Internal server error", EC: -1, DT: null });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const removed = await courseService.deleteCourse(req.params.id);
    if (!removed)
      return res.status(404).json({ EM: "Course not found", EC: 1, DT: null });
    res.json({ EM: "Course deleted", EC: 0, DT: removed });
  } catch (error) {
    console.error("courseController deleteCourse", error);
    res.status(500).json({ EM: "Internal server error", EC: -1, DT: null });
  }
};

export default {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
