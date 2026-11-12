const Service = require("../models/Service");
const Category = require("../models/Category");

const loadGlobalData = async (req, res, next) => {
  // Shared partials read these on every page, including error pages rendered for /admin and /api
  res.locals.headerServices = [];
  res.locals.footerServices = [];
  res.locals.footerCategories = [];
  res.locals.services = [];

  try {
    // Skip loading public website data for API and admin requests
    if (
      req.originalUrl.startsWith("/api") ||
      req.originalUrl.startsWith("/admin")
    ) {
      return next();
    }

    const [services, categories] = await Promise.all([
      Service.find({
        status: "published",
      })
        .select("title slug category shortDescription images price duration")
        .sort({ createdAt: -1 })
        .lean(),
      Category.find({ is_active: true })
        .select("name")
        .sort({ sort_order: 1, createdAt: -1 })
        .limit(6)
        .lean(),
    ]);

    // Make services available to all EJS views
    res.locals.headerServices = services;
    res.locals.footerServices = services.slice(0, 5);
    res.locals.footerCategories = categories;

    next();
  } catch (err) {
    console.error("GLOBAL DATA ERROR:", err);
    next();
  }
};

module.exports = loadGlobalData;