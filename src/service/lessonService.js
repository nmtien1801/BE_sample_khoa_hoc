import db from "../models/index.js";
import { Op } from "sequelize";

const Lesson = db.Lesson;

const getAllLessons = async (filters = {}) => {
  const where = {};

  if (filters.courseId) {
    where.courseId = filters.courseId;
  }

  if (filters.title) {
    where.title = { [Op.like]: `%${filters.title}%` };
  }

  return await Lesson.findAll({ where, order: [["order", "ASC"]] });
};

const getLessonById = async (id) => {
  return await Lesson.findByPk(id);
};

const createLesson = async (payload) => {
  return await Lesson.create(payload);
};

const updateLesson = async (id, payload) => {
  const lesson = await Lesson.findByPk(id);
  if (!lesson) return null;
  return await lesson.update(payload);
};

const deleteLesson = async (id) => {
  const lesson = await Lesson.findByPk(id);
  if (!lesson) return null;
  await lesson.destroy();
  return lesson;
};

export default {
  getAllLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
};
