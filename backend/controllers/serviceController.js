const Service = require("../models/Service");
const Category = require("../models/Category");
const fs = require("fs");
const path = require("path");

function parseOptionalPrice(value) {
  if (value === undefined || value === null || value === "") {
    return { valid: true, price: null };
  }
  const price = Number(value);
  return {
    valid: Number.isFinite(price) && price >= 0,
    price,
  };
}

function parseOptionalDuration(value) {
  if (value === undefined || value === null || value === "") {
    return { valid: true, duration: null };
  }
  const duration = Number(value);
  return {
    valid: Number.isInteger(duration) && duration >= 1,
    duration,
  };
}

function removeUploadedImages(files) {
  for (const file of files || []) {
    try {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (error) {
      console.error("Failed to remove uploaded service image:", error);
    }
  }
}

async function resolveCategory(categoryId, legacyName) {
  const category = categoryId
    ? await Category.findById(categoryId)
    : legacyName
      ? await Category.findOne({ name: legacyName })
      : null;
  if (!categoryId && !legacyName) {
    return { valid: true, category: "", categoryId: null };
  }
  if (!category) {
    if (!categoryId) {
      return { valid: true, category: legacyName, categoryId: null };
    }
    return { valid: false };
  }
  return {
    valid: true,
    category: category.name,
    categoryId: category._id,
  };
}

// ========================================
// CREATE SERVICE
// ========================================

const createService = async (req, res) => {
  try {
    const {
      title,
      category,
      categoryId,
      price,
      duration,
      shortDescription,
      content,
      status,
      metaTitle,
      metaDescription,
      tags,
    } = req.body;

    // Validate required fields
    if (!title  || !shortDescription || !content) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const parsedPrice = parseOptionalPrice(price);
    if (!parsedPrice.valid) {
      removeUploadedImages(req.files);
      return res.status(400).json({
        success: false,
        message: "Price must be a non-negative number or left blank.",
      });
    }
    const parsedDuration = parseOptionalDuration(duration);
    if (!parsedDuration.valid) {
      removeUploadedImages(req.files);
      return res.status(400).json({
        success: false,
        message: "Duration must be a positive whole number of minutes or left blank.",
      });
    }
    const resolvedCategory = await resolveCategory(categoryId, category);
    if (!resolvedCategory.valid) {
      removeUploadedImages(req.files);
      return res.status(400).json({
        success: false,
        message: "Please select a valid service category.",
      });
    }
    if (!resolvedCategory.category) {
      removeUploadedImages(req.files);
      return res.status(400).json({
        success: false,
        message: "Please select a service category.",
      });
    }

    // Images required
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one service image is required.",
      });
    }

    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

    let parsedTags = [];

    try {
      parsedTags = tags ? JSON.parse(tags) : [];
    } catch (error) {
      removeUploadedImages(req.files);
      return res.status(400).json({
        success: false,
        message: "Invalid tags format.",
      });
    }

    const service = await Service.create({
      title,
      category: resolvedCategory.category,
      categoryId: resolvedCategory.categoryId,
      price: parsedPrice.price,
      duration: parsedDuration.duration,
      shortDescription,
      content,
      status: status || "published",
      images: imagePaths,

      metaTitle: metaTitle || "",
      metaDescription: metaDescription || "",
      tags: parsedTags,
    });

    return res.status(201).json({
      success: true,
      message: "Service created successfully.",
      service,
    });
  } catch (error) {
    console.error("Create service error:", error);
    removeUploadedImages(req.files);

    return res.status(500).json({
      success: false,
      message: "Failed to create service.",
      error: error.message,
    });
  }
};

// ========================================
// GET ALL SERVICES
// ========================================

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Get services error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch services.",
      error: error.message,
    });
  }
};

// ========================================
// GET SERVICE BY ID
// ========================================

const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    return res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Get service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch service.",
      error: error.message,
    });
  }
};

// ========================================
// GET SERVICE BY SLUG
// ========================================

const getServiceBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({
      slug: req.params.slug,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    return res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Get service by slug error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch service.",
      error: error.message,
    });
  }
};

// ========================================
// UPDATE SERVICE
// ========================================

const updateService = async (req, res) => {
  let serviceSaved = false;
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      removeUploadedImages(req.files);
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    const parsedPrice =
      req.body.price === undefined
        ? null
        : parseOptionalPrice(req.body.price);
    if (parsedPrice && !parsedPrice.valid) {
      removeUploadedImages(req.files);
      return res.status(400).json({
        success: false,
        message: "Price must be a non-negative number or left blank.",
      });
    }
    const parsedDuration =
      req.body.duration === undefined
        ? null
        : parseOptionalDuration(req.body.duration);
    if (parsedDuration && !parsedDuration.valid) {
      removeUploadedImages(req.files);
      return res.status(400).json({
        success: false,
        message: "Duration must be a positive whole number of minutes or left blank.",
      });
    }
    const resolvedCategory = await resolveCategory(
      req.body.categoryId,
      req.body.category,
    );
    if (!resolvedCategory.valid) {
      removeUploadedImages(req.files);
      return res.status(400).json({
        success: false,
        message: "Please select a valid service category.",
      });
    }
    if (!resolvedCategory.category) {
      removeUploadedImages(req.files);
      return res.status(400).json({
        success: false,
        message: "Please select a service category.",
      });
    }

    // ========================================
    // UPDATE BASIC DETAILS
    // ========================================

    service.title = req.body.title;
    service.category = resolvedCategory.category;
    service.categoryId = resolvedCategory.categoryId;
    if (parsedPrice) {
      service.price = parsedPrice.price;
    }
    if (parsedDuration) {
      service.duration = parsedDuration.duration;
    }
    service.shortDescription = req.body.shortDescription;
    service.content = req.body.content;
    service.status = req.body.status || "published";

    let parsedTags = [];

    try {
      parsedTags = req.body.tags ? JSON.parse(req.body.tags) : [];
    } catch (error) {
      removeUploadedImages(req.files);
      return res.status(400).json({
        success: false,
        message: "Invalid tags format.",
      });
    }

    service.metaTitle = req.body.metaTitle || "";
    service.metaDescription = req.body.metaDescription || "";
    service.tags = parsedTags;
    // ========================================
    // EXISTING IMAGES
    // ========================================

    const currentImages = Array.isArray(service.images)
      ? [...service.images]
      : [];

    // ========================================
    // REMOVED IMAGES
    // ========================================

    let removedImages = [];

    if (req.body.removedImages) {
      removedImages = Array.isArray(req.body.removedImages)
        ? req.body.removedImages
        : [req.body.removedImages];
    }

    // Only allow removal of images that
    // actually belong to this service
    const imagesToRemove = currentImages.filter((image) =>
      removedImages.includes(image),
    );

    // Keep images that were NOT removed
    const remainingImages = currentImages.filter(
      (image) => !removedImages.includes(image),
    );

    // ========================================
    // NEW IMAGES
    // ========================================

    const newImages = (req.files || []).map(
      (file) => `/uploads/${file.filename}`,
    );

    // ========================================
    // FINAL IMAGE LIST
    // ========================================

    const finalImages = [...remainingImages, ...newImages];

    // At least one image must remain
    if (finalImages.length === 0) {
      removeUploadedImages(req.files);
      return res.status(400).json({
        success: false,
        message: "At least one service image is required.",
      });
    }

    // Maximum 10 images
    if (finalImages.length > 10) {
      removeUploadedImages(req.files);
      return res.status(400).json({
        success: false,
        message: "A maximum of 10 images is allowed.",
      });
    }

    // ========================================
    // SAVE DATABASE
    // ========================================

    service.images = finalImages;

    await service.save();
    serviceSaved = true;

    // ========================================
    // DELETE REMOVED IMAGE FILES
    // ========================================

    for (const image of imagesToRemove) {
      const imagePath = path.join(
        __dirname,
        "..",
        image.replace(/^[/\\]+/, ""),
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // ========================================
    // RESPONSE
    // ========================================

    res.status(200).json({
      success: true,
      message: "Service updated successfully.",
      service,
    });
  } catch (error) {
    console.error("Update service error:", error);
    if (!serviceSaved) {
      removeUploadedImages(req.files);
    }

    res.status(500).json({
      success: false,
      message: "Failed to update service.",
      error: error.message,
    });
  }
};

// ========================================
// DELETE SERVICE
// ========================================

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    // Delete image from uploads folder
    if (service.image) {
      const imagePath = path.join(__dirname, "..", service.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Service.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully.",
    });
  } catch (error) {
    console.error("Delete service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete service.",
      error: error.message,
    });
  }
};

// ========================================
// TOGGLE SERVICE STATUS
// ========================================

const toggleServiceStatus = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    service.status = service.status === "published" ? "draft" : "published";

    await service.save();

    return res.status(200).json({
      success: true,
      message: `Service ${
        service.status === "published" ? "published" : "moved to draft"
      } successfully.`,
      status: service.status,
    });
  } catch (error) {
    console.error("Toggle service status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update service status.",
      error: error.message,
    });
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  getServiceBySlug,
  updateService,
  deleteService,
  toggleServiceStatus,
};
