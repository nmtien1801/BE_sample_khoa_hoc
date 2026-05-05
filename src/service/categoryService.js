import db from "../models/index.js";

const Category = db.Category;

const getAllCategories = async () => {
  return await Category.findAll({ order: [["name", "ASC"]] });
};

const getCategoryById = async (id) => {
  return await Category.findByPk(id);
};

const createCategory = async (payload) => {
  return await Category.create(payload);
};

const updateCategory = async (id, payload) => {
  const category = await Category.findByPk(id);
  if (!category) return null;
  return await category.update(payload);
};

const deleteCategory = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) return null;
  await category.destroy();
  return category;
};

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
