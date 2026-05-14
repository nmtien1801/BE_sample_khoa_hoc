import categoryService from "../service/categoryService.js";

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json({ data: categories, total: categories.length });
  } catch (error) {
    console.error("categoryController getAllCategories", error);
    res.status(500).json({ message: "Internal server error", error, data: [] });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category)
      return res
        .status(404)
        .json({ message: "Category not found", data: null });
    res.json({ data: category });
  } catch (error) {
    console.error("categoryController getCategoryById", error);
    res.status(500).json({ message: "Internal server error", data: null });
  }
};

const createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({ message: "Category created", data: category });
  } catch (error) {
    console.error("categoryController createCategory", error);
    res.status(500).json({ message: "Internal server error", data: null });
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
        .json({ message: "Category not found", data: null });
    res.json({ message: "Category updated", data: updated });
  } catch (error) {
    console.error("categoryController updateCategory", error);
    res.status(500).json({ message: "Internal server error", data: null });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const removed = await categoryService.deleteCategory(req.params.id);
    if (!removed)
      return res
        .status(404)
        .json({ message: "Category not found", data: null });
    res.json({ message: "Category deleted", data: removed });
  } catch (error) {
    console.error("categoryController deleteCategory", error);
    res.status(500).json({ message: "Internal server error", data: null });
  }
};

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
