import db from "../models/index.js";
import { Op } from "sequelize";

const Course = db.Course;
const Category = db.Category;
const Teacher = db.Teacher;
const Lesson = db.Lesson;

const getAllCourses = async (filters = {}) => {
  const where = {};

  if (filters.title) {
    where.title = { [Op.like]: `%${filters.title}%` };
  }

  if (filters.category) {
    where[Op.or] = [
      { "$Category.name$": { [Op.like]: `%${filters.category}%` } },
      { "$Category.slug$": { [Op.like]: `%${filters.category}%` } },
    ];
  }

  if (filters.teacher) {
    where[Op.or] = [
      ...(where[Op.or] || []),
      { "$Teacher.name$": { [Op.like]: `%${filters.teacher}%` } },
    ];
  }

  return await Course.findAll({
    where,
    include: [
      Category,
      Teacher,
      {
        model: Lesson,
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

const getCourseById = async (id) => {
  return await Course.findByPk(id, {
    include: [Category, Teacher, Lesson],
  });
};

const createCourse = async (payload) => {
  return await Course.create(payload);
};

const updateCourse = async (id, payload) => {
  const course = await Course.findByPk(id);
  if (!course) return null;
  return await course.update(payload);
};

const deleteCourse = async (id) => {
  const course = await Course.findByPk(id);
  if (!course) return null;
  await course.destroy();
  return course;
};

export default {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
