import categoryService from "../service/categoryService.js";

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json({ EM: "OK", EC: 0, DT: categories });
  } catch (error) {
    console.error("categoryController getAllCategories", error);
    res.status(500).json({ EM: "Internal server error", EC: -1, DT: [] });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category)
      return res
        .status(404)
        .json({ EM: "Category not found", EC: 1, DT: null });
    res.json({ EM: "OK", EC: 0, DT: category });
  } catch (error) {
    console.error("categoryController getCategoryById", error);
    res.status(500).json({ EM: "Internal server error", EC: -1, DT: null });
  }
};

const createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({ EM: "Category created", EC: 0, DT: category });
  } catch (error) {
    console.error("categoryController createCategory", error);
    res.status(500).json({ EM: "Internal server error", EC: -1, DT: null });
  }
};

const updateCategory = async (req, res) => {
  try {
    const updated = await categoryService.updateCategory(
      req.params.id,
      req.body,
    );
    if (!updated)
      return res
        .status(404)
        .json({ EM: "Category not found", EC: 1, DT: null });
    res.json({ EM: "Category updated", EC: 0, DT: updated });
  } catch (error) {
    console.error("categoryController updateCategory", error);
    res.status(500).json({ EM: "Internal server error", EC: -1, DT: null });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const removed = await categoryService.deleteCategory(req.params.id);
    if (!removed)
      return res
        .status(404)
        .json({ EM: "Category not found", EC: 1, DT: null });
    res.json({ EM: "Category deleted", EC: 0, DT: removed });
  } catch (error) {
    console.error("categoryController deleteCategory", error);
    res.status(500).json({ EM: "Internal server error", EC: -1, DT: null });
  }
};

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
