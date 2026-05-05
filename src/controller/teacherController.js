import teacherService from "../service/teacherService.js";

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await teacherService.getAllTeachers();
    res.json({ EM: "OK", EC: 0, DT: teachers });
  } catch (error) {
    console.error("teacherController getAllTeachers", error);
    res.status(500).json({ EM: "Internal server error", EC: -1, DT: [] });
  }
};

const getTeacherById = async (req, res) => {
  try {
    const teacher = await teacherService.getTeacherById(req.params.id);
    if (!teacher)
      return res.status(404).json({ EM: "Teacher not found", EC: 1, DT: null });
    res.json({ EM: "OK", EC: 0, DT: teacher });
  } catch (error) {
    console.error("teacherController getTeacherById", error);
    res.status(500).json({ EM: "Internal server error", EC: -1, DT: null });
  }
};

const createTeacher = async (req, res) => {
  try {
    const teacher = await teacherService.createTeacher(req.body);
    res.status(201).json({ EM: "Teacher created", EC: 0, DT: teacher });
  } catch (error) {
    console.error("teacherController createTeacher", error);
    res.status(500).json({ EM: "Internal server error", EC: -1, DT: null });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const updated = await teacherService.updateTeacher(req.params.id, req.body);
    if (!updated)
      return res.status(404).json({ EM: "Teacher not found", EC: 1, DT: null });
    res.json({ EM: "Teacher updated", EC: 0, DT: updated });
  } catch (error) {
    console.error("teacherController updateTeacher", error);
    res.status(500).json({ EM: "Internal server error", EC: -1, DT: null });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const removed = await teacherService.deleteTeacher(req.params.id);
    if (!removed)
      return res.status(404).json({ EM: "Teacher not found", EC: 1, DT: null });
    res.json({ EM: "Teacher deleted", EC: 0, DT: removed });
  } catch (error) {
    console.error("teacherController deleteTeacher", error);
    res.status(500).json({ EM: "Internal server error", EC: -1, DT: null });
  }
};

export default {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
