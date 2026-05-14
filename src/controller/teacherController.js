import teacherService from "../service/teacherService.js";

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await teacherService.getAllTeachers();
    res.json({ data: teachers, total: teachers.length });
  } catch (error) {
    console.error("teacherController getAllTeachers", error);
    res.status(500).json({ message: "Internal server error", error, data: [] });
  }
};

const getTeacherById = async (req, res) => {
  try {
    const teacher = await teacherService.getTeacherById(req.params.id);
    if (!teacher)
      return res.status(404).json({ message: "Teacher not found", data: null });
    res.json({ data: teacher });
  } catch (error) {
    console.error("teacherController getTeacherById", error);
    res.status(500).json({ message: "Internal server error", data: null });
  }
};

const createTeacher = async (req, res) => {
  try {
    const teacher = await teacherService.createTeacher(req.body);
    res.status(201).json({ message: "Teacher created", data: teacher });
  } catch (error) {
    console.error("teacherController createTeacher", error);
    res.status(500).json({ message: "Internal server error", data: null });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const updated = await teacherService.updateTeacher(req.params.id, req.body);
    if (!updated)
      return res.status(404).json({ message: "Teacher not found", data: null });
    res.json({ message: "Teacher updated", data: updated });
  } catch (error) {
    console.error("teacherController updateTeacher", error);
    res.status(500).json({ message: "Internal server error", data: null });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const removed = await teacherService.deleteTeacher(req.params.id);
    if (!removed)
      return res.status(404).json({ message: "Teacher not found", data: null });
    res.json({ message: "Teacher deleted", data: removed });
  } catch (error) {
    console.error("teacherController deleteTeacher", error);
    res.status(500).json({ message: "Internal server error", data: null });
  }
};

export default {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
