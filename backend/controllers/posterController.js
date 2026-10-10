const fs = require("fs");
const path = require("path");
const Poster = require("../models/Poster");

function deleteImageFile(imagePath) {
  if (!imagePath) {
    return;
  }

  const cleanPath = imagePath.replace(/^[\/\\]+/, "");
  const filePath = path.join(__dirname, "..", cleanPath);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Failed to remove poster image:", error);
  }
}

function removeUploadedFile(filePath) {
  if (!filePath) {
    return;
  }

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Failed to remove uploaded poster image:", error);
  }
}

const createPoster = async (req, res) => {
  const uploadedFilePath = req.file?.path;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Poster image is required.",
      });
    }

    if (
      !["image/jpeg", "image/png", "image/webp"].includes(req.file.mimetype) ||
      req.file.size > 2 * 1024 * 1024
    ) {
      removeUploadedFile(uploadedFilePath);
      return res.status(400).json({
        success: false,
        message: "Choose a JPG, PNG, or WebP image no larger than 2MB.",
      });
    }

    const sortOrder =
      req.body.sort_order === undefined || req.body.sort_order === ""
        ? 0
        : Number(req.body.sort_order);

    if (!Number.isFinite(sortOrder) || sortOrder < 0) {
      removeUploadedFile(uploadedFilePath);
      return res.status(400).json({
        success: false,
        message: "Sort order must be a non-negative number.",
      });
    }

    const poster = await Poster.create({
      title: (req.body.title || "").trim(),
      image: `/uploads/${req.file.filename}`,
      alt_text: (req.body.alt_text || "").trim(),
      sort_order: sortOrder,
      is_active:
        req.body.is_active === undefined
          ? true
          : req.body.is_active === true || req.body.is_active === "true",
    });

    return res.status(201).json({
      success: true,
      message: "Poster created successfully.",
      poster,
    });
  } catch (error) {
    console.error("Create poster error:", error);
    removeUploadedFile(uploadedFilePath);

    return res.status(500).json({
      success: false,
      message: "Failed to create poster.",
      error: error.message,
    });
  }
};

const getAllPosters = async (req, res) => {
  try {
    const posters = await Poster.find().sort({
      sort_order: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: posters.length,
      posters,
    });
  } catch (error) {
    console.error("Get posters error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch posters.",
      error: error.message,
    });
  }
};

const updatePoster = async (req, res) => {
  const uploadedFilePath = req.file?.path;

  try {
    const poster = await Poster.findById(req.params.id);
    if (!poster) {
      removeUploadedFile(uploadedFilePath);
      return res.status(404).json({
        success: false,
        message: "Poster not found.",
      });
    }

    if (
      req.file &&
      (!["image/jpeg", "image/png", "image/webp"].includes(req.file.mimetype) ||
        req.file.size > 2 * 1024 * 1024)
    ) {
      removeUploadedFile(uploadedFilePath);
      return res.status(400).json({
        success: false,
        message: "Choose a JPG, PNG, or WebP image no larger than 2MB.",
      });
    }

    let sortOrder = poster.sort_order;
    if (req.body.sort_order !== undefined && req.body.sort_order !== "") {
      sortOrder = Number(req.body.sort_order);
      if (!Number.isFinite(sortOrder) || sortOrder < 0) {
        removeUploadedFile(uploadedFilePath);
        return res.status(400).json({
          success: false,
          message: "Sort order must be a non-negative number.",
        });
      }
    }

    const oldImage = poster.image;
    if (req.body.title !== undefined) {
      poster.title = req.body.title.trim();
    }
    if (req.body.alt_text !== undefined) {
      poster.alt_text = req.body.alt_text.trim();
    }
    poster.sort_order = sortOrder;
    if (req.body.is_active !== undefined) {
      poster.is_active =
        req.body.is_active === true || req.body.is_active === "true";
    }
    if (req.file) {
      poster.image = `/uploads/${req.file.filename}`;
    }

    await poster.save();

    if (req.file && oldImage) {
      deleteImageFile(oldImage);
    }

    return res.status(200).json({
      success: true,
      message: "Poster updated successfully.",
      poster,
    });
  } catch (error) {
    console.error("Update poster error:", error);
    removeUploadedFile(uploadedFilePath);

    return res.status(500).json({
      success: false,
      message: "Failed to update poster.",
      error: error.message,
    });
  }
};

const togglePosterStatus = async (req, res) => {
  try {
    const poster = await Poster.findById(req.params.id);
    if (!poster) {
      return res.status(404).json({
        success: false,
        message: "Poster not found.",
      });
    }

    poster.is_active = !poster.is_active;
    await poster.save();

    return res.status(200).json({
      success: true,
      message: poster.is_active
        ? "Poster activated successfully."
        : "Poster deactivated successfully.",
      is_active: poster.is_active,
    });
  } catch (error) {
    console.error("Toggle poster status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update poster status.",
      error: error.message,
    });
  }
};

const deletePoster = async (req, res) => {
  try {
    const poster = await Poster.findById(req.params.id);
    if (!poster) {
      return res.status(404).json({
        success: false,
        message: "Poster not found.",
      });
    }

    const image = poster.image;
    await Poster.findByIdAndDelete(req.params.id);
    deleteImageFile(image);

    return res.status(200).json({
      success: true,
      message: "Poster deleted successfully.",
    });
  } catch (error) {
    console.error("Delete poster error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete poster.",
      error: error.message,
    });
  }
};

module.exports = {
  createPoster,
  getAllPosters,
  updatePoster,
  togglePosterStatus,
  deletePoster,
};