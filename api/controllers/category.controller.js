import Category from "../models/category.model.js";
import { errorHandler } from '../utils/error.js';

export const create = async (req, res, next) => {
  const { name } = req.body;
  try {
    const newCategory = new Category({
      name,
    });
    await newCategory.save();
    res.status(200).json(newCategory);
  } catch (error) {
    next(error);
  }
};
export const create1 = async (req, res, next) => {
  const name = req.params.name;
  try {
    const newCategory = new Category({
      name,
    });
    await newCategory.save();
    res.status(200).json(newCategory);
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    const totalCategories = await Category.countDocuments();
    if (!categories) {
      return next(errorHandler(404, "Category not found"));
    }
    res.status(200).json({ categories, totalCategories });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return next(errorHandler(404, "Category not found"));
    }
    if (!req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to delete this category")
      );
    }
    await Category.findByIdAndDelete(req.params.categoryId);
    res.status(200).json("Category has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return next(errorHandler(404, "Category not found"));
    }
    if (!req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to edit this category")
      );
    }

    const editedCategory = await Category.findByIdAndUpdate(
      req.params.categoryId,
      {
        $set: {
          name: req.body.name,
        },
      },
      { new: true }
    );
    res.status(200).json(editedCategory);
  } catch (error) {
    next(error);
  }
};
