const fs = require("fs");
const path = require("path");
const Category = require("../models/Category");
const Service = require("../models/Service");

function removeUploadedFile(filePath) {
  if (!filePath) {
    return;
  }
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Failed to remove uploaded category image:", error);
  }
}

function deleteCategoryImage(imagePath) {
  if (!imagePath) {
    return;
  }
  const filePath = path.join(
    __dirname,
    "..",
    imagePath.replace(/^[\/\\]+/, ""),
  );
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Failed to delete category image:", error);
  }
}

function validImage(file) {
  return (
    file &&
    ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype) &&
    file.size <= 2 * 1024 * 1024
  );
}

function parseSortOrder(value, fallback = 0) {
  if (value === undefined || value === "") {
    return fallback;
  }
  const sortOrder = Number(value);
  return Number.isFinite(sortOrder) && sortOrder >= 0 ? sortOrder : null;
}

const createCategory = async (req, res) => {
  const uploadedFilePath = req.file?.path;
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Category image is required.",
      });
    }
    if (!validImage(req.file)) {
      removeUploadedFile(uploadedFilePath);
      return res.status(400).json({
        success: false,
        message: "Choose a JPG, PNG, or WebP image no larger than 2MB.",
      });
    }

    const submittedTitle = req.body.title ?? req.body.name ?? "";
    if (typeof submittedTitle !== "string") {
      removeUploadedFile(uploadedFilePath);
      return res.status(400).json({
        success: false,
        message: "Category title must be text.",
      });
    }
    const title = submittedTitle.trim();
    if (!title) {
      removeUploadedFile(uploadedFilePath);
      return res.status(400).json({
        success: false,
        message: "Category title is required.",
      });
    }
    if (title.length > 120) {
      removeUploadedFile(uploadedFilePath);
      return res.status(400).json({
        success: false,
        message: "Category title must be 120 characters or fewer.",
      });
    }
    const sortOrder = parseSortOrder(req.body.sort_order);
    if (sortOrder === null) {
      removeUploadedFile(uploadedFilePath);
      return res.status(400).json({
        success: false,
        message: "Sort order must be a non-negative number.",
      });
    }

    const category = await Category.create({
      name: title,
      title,
      alt_text: (req.body.alt_text || "").trim(),
      image: `/uploads/${req.file.filename}`,
      sort_order: sortOrder,
      is_active:
        req.body.is_active === undefined
          ? true
          : req.body.is_active === true || req.body.is_active === "true",
    });
    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);
    removeUploadedFile(uploadedFilePath);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A category with this title already exists.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to create category.",
      error: error.message,
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ sort_order: 1, createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories.",
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  const uploadedFilePath = req.file?.path;
  let categorySaved = false;
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      removeUploadedFile(uploadedFilePath);
      return res.status(404).json({ success: false, message: "Category not found." });
    }
    if (req.file && !validImage(req.file)) {
      removeUploadedFile(uploadedFilePath);
      return res.status(400).json({
        success: false,
        message: "Choose a JPG, PNG, or WebP image no larger than 2MB.",
      });
    }

    const previousName = category.name;
    const previousTitle = category.title;
    const submittedTitle = req.body.title ?? req.body.name;
    if (submittedTitle !== undefined) {
      if (typeof submittedTitle !== "string") {
        removeUploadedFile(uploadedFilePath);
        return res.status(400).json({
          success: false,
          message: "Category title must be text.",
        });
      }
      const title = submittedTitle.trim();
      if (!title) {
        removeUploadedFile(uploadedFilePath);
        return res.status(400).json({
          success: false,
          message: "Category title is required.",
        });
      }
      if (title.length > 120) {
        removeUploadedFile(uploadedFilePath);
        return res.status(400).json({
          success: false,
          message: "Category title must be 120 characters or fewer.",
        });
      }
      category.name = title;
      category.title = title;
    }
    if (req.body.alt_text !== undefined) {
      category.alt_text = req.body.alt_text.trim();
    }
    if (req.body.sort_order !== undefined) {
      const sortOrder = parseSortOrder(req.body.sort_order, category.sort_order);
      if (sortOrder === null) {
        removeUploadedFile(uploadedFilePath);
        return res.status(400).json({
          success: false,
          message: "Sort order must be a non-negative number.",
        });
      }
      category.sort_order = sortOrder;
    }
    if (req.body.is_active !== undefined) {
      category.is_active =
        req.body.is_active === true || req.body.is_active === "true";
    }

    const oldImage = category.image;
    if (req.file) {
      category.image = `/uploads/${req.file.filename}`;
    }
    await category.save();
    categorySaved = true;

    if (previousName !== category.name) {
      await Service.updateMany(
        { categoryId: category._id },
        { $set: { category: category.name } },
      );
      await Service.updateMany(
        { category: previousName, categoryId: null },
        { $set: { category: category.name, categoryId: category._id } },
      );
    }
    if (previousTitle && previousTitle !== category.title) {
      await Service.updateMany(
        { category: previousTitle, categoryId: null },
        { $set: { category: category.name, categoryId: category._id } },
      );
    }
    if (req.file) {
      deleteCategoryImage(oldImage);
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      category,
    });
  } catch (error) {
    console.error("Update category error:", error);
    if (!categorySaved) {
      removeUploadedFile(uploadedFilePath);
    }
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A category with this title already exists.",
      });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid category ID." });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to update category.",
      error: error.message,
    });
  }
};

const toggleCategoryStatus = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }
    category.is_active = !category.is_active;
    await category.save();
    return res.status(200).json({
      success: true,
      message: category.is_active ? "Category activated." : "Category deactivated.",
      is_active: category.is_active,
    });
  } catch (error) {
    console.error("Toggle category status error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid category ID." });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to update category status.",
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }
    const servicesUsingCategory = await Service.exists({
      $or: [
        { categoryId: category._id },
        { category: category.name },
      ],
    });
    if (servicesUsingCategory) {
      return res.status(409).json({
        success: false,
        message: "This category has services. Move or delete those services before deleting the category.",
      });
    }

    await Category.findByIdAndDelete(category._id);
    deleteCategoryImage(category.image);
    return res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid category ID." });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to delete category.",
      error: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory,
};