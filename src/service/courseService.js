import db from "../models/index.js";
import { Op } from "sequelize";

const Course = db.Course;
const Category = db.Category;
const Teacher = db.Teacher;
const Lesson = db.Lesson;
const Order = db.Order; // Đảm bảo gọi thêm model Order

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

// ─────────────────────────────────────────────────────────────────────────────
// BỔ SUNG: Lấy danh sách khóa học mà User đã mua thành công qua bảng Order
// ─────────────────────────────────────────────────────────────────────────────
const getCoursesByUserId = async (userId) => {
  if (!Order) {
    console.error("Model Order chưa được định nghĩa trong db");
    return [];
  }

  // 1. Tìm tất cả các Order hoàn thành của User, Join với bảng Course và Lesson
  const orders = await Order.findAll({
    where: {
      userId: userId,
      status: "completed", // Đơn hàng đã xử lý thành công
    },
    include: [
      {
        model: Course,
        as: "course", // Tên alias phải khớp với định nghĩa trong Order.belongsTo(models.Course, { as: "course" })
        include: [
          Category,
          Teacher,
          { model: Lesson }, // Include kèm Lesson để Controller có dữ liệu xử lý sanitizeLessonData
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  // 2. Trích xuất (map) danh sách các Course từ tập hợp Đơn hàng và loại bỏ phần tử rỗng (nếu có)
  const purchasedCourses = orders
    .map((order) => order.course)
    .filter((course) => course !== null && course !== undefined);

  return purchasedCourses;
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

const getAllAdminCourses = async (filters = {}) => {
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
    include: [Category, Teacher, Lesson],
    order: [["createdAt", "DESC"]],
  });
};

export default {
  getAllCourses,
  getCoursesByUserId,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllAdminCourses,
};
