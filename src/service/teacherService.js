import db from "../models/index.js";

const Teacher = db.Teacher;

const getAllTeachers = async () => {
  return await Teacher.findAll({ order: [["name", "ASC"]] });
};

const getTeacherById = async (id) => {
  return await Teacher.findByPk(id);
};

const createTeacher = async (payload) => {
  return await Teacher.create(payload);
};

const updateTeacher = async (id, payload) => {
  const teacher = await Teacher.findByPk(id);
  if (!teacher) return null;
  return await teacher.update(payload);
};

const deleteTeacher = async (id) => {
  const teacher = await Teacher.findByPk(id);
  if (!teacher) return null;
  await teacher.destroy();
  return teacher;
};

export default {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
