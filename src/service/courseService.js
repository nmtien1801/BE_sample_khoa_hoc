import db from "../models/index.js";

const Course = db.Course;
const Category = db.Category;
const Teacher = db.Teacher;
const Lesson = db.Lesson;

const getAllCourses = async () => {
  return await Course.findAll({
    include: [Category, Teacher],
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
