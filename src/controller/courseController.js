import courseService from "../service/courseService.js";

const getAllCourses = async (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      teacher: req.query.teacher,
      title: req.query.title,
    };
    const courses = await courseService.getAllCourses(filters);
    res.json({ data: courses, total: courses.length });
  } catch (error) {
    console.error("courseController getAllCourses", error);
    res.status(500).json({ message: "Internal server error", error, data: [] });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    if (!course)
      return res.status(404).json({ message: "Course not found", data: null });
    res.json({ data: course });
  } catch (error) {
    console.error("courseController getCourseById", error);
    res.status(500).json({ message: "Internal server error", data: null });
  }
};

const createCourse = async (req, res) => {
  try {
    const newCourse = await courseService.createCourse(req.body);
    res.status(201).json({ message: "Course created", data: newCourse });
  } catch (error) {
    console.error("courseController createCourse", error);
    res.status(500).json({ message: "Internal server error", data: null });
  }
};

const updateCourse = async (req, res) => {
  try {
    const updated = await courseService.updateCourse(req.params.id, req.body);
    if (!updated)
      return res.status(404).json({ message: "Course not found", data: null });
    res.json({ message: "Course updated", data: updated });
  } catch (error) {
    console.error("courseController updateCourse", error);
    res.status(500).json({ message: "Internal server error", data: null });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const removed = await courseService.deleteCourse(req.params.id);
    if (!removed)
      return res.status(404).json({ message: "Course not found", data: null });
    res.json({ message: "Course deleted", data: removed });
  } catch (error) {
    console.error("courseController deleteCourse", error);
    res.status(500).json({ message: "Internal server error", data: null });
  }
};

export default {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
