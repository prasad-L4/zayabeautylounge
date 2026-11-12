const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const MainBanner = require("../models/MainBanner");
const MobileBanner = require("../models/MobileBanner");
const Testimonial = require("../models/Testimonial");
const Gallery = require("../models/Gallery");
const Blog = require("../models/Blog");
const Tips = require("../models/Tips");
const Category = require("../models/Category");
const Poster = require("../models/Poster");
const sanitizeHtml = require("sanitize-html");

// Home Page
router.get("/", async (req, res, next) => {
  try {
    const [
      services,
      categories,
      desktopBanners,
      mobileBanners,
      poster,
      testimonials,
      gallery,
      blogs,
    ] = await Promise.all([
      Service.find({
        status: "published",
      })
        .select(
          "title slug shortDescription images category categoryId duration price",
        )
        .sort({ createdAt: -1 })
        .lean(),

      Category.find({ is_active: true })
        .sort({ sort_order: 1, createdAt: -1 })
        .lean(),

      MainBanner.find({
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .lean(),

      MobileBanner.find({
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .lean(),

      Poster.findOne({ is_active: true })
        .sort({ sort_order: 1, createdAt: -1 })
        .lean(),

      Testimonial.find({
        isActive: true,
      })
        .select("name designation content imageUrl rating")
        .sort({ createdAt: -1 })
        .lean(),

      Gallery.find({
        is_active: true,
      })
        .sort({ sort_order: 1, createdAt: -1 })
        .lean(),

      Blog.find({
        status: "published",
      })
        .select("title slug content author imageUrl createdAt")
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
    ]);

    res.render("user/home", {
      services,
      categories,
      desktopBanners,
      mobileBanners,
      poster,
      testimonials,
      gallery,
      blogs,
    });
  } catch (error) {
    console.error("HOME PAGE ERROR:", error);
    next(error);
  }
});

// About Page
router.get("/about", async (req, res, next) => {
  try {
    const [testimonials, gallery, blogs] = await Promise.all([
      Testimonial.find({
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .lean(),

      Gallery.find({
        is_active: true,
      })
        .sort({ sort_order: 1, createdAt: -1 })
        .lean(),

      Blog.find({
        status: "published",
      })
        .select("title slug content imageUrl createdAt")
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
    ]);

    res.render("user/about", {
      testimonials,
      gallery,
      blogs,
    });
  } catch (error) {
    console.error("ABOUT PAGE ERROR:", error);
    next(error);
  }
});

// Services Page
router.get("/services", async (req, res, next) => {
  try {
    const categories = await Category.find({ is_active: true })
      .sort({ sort_order: 1, createdAt: -1 })
      .lean();
    const requestedCategory =
      typeof req.query.category === "string" ? req.query.category : "all";
    const selectedCategory = categories.some(
      (category) => String(category._id) === requestedCategory,
    )
      ? requestedCategory
      : "all";

    const [testimonials, services] = await Promise.all([
      Testimonial.find({ isActive: true }).sort({ createdAt: -1 }).lean(),
      Service.find({
        status: "published",
      })
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    res.render("user/services", {
      services,
      categories,
      selectedCategory,
      totalServices: services.length,
      testimonials,
    });
  } catch (error) {
    next(error);
  }
});

// Service Details Page
router.get("/services/:slug", async (req, res, next) => {
  try {
    const [service, services] = await Promise.all([
      Service.findOne({
        slug: req.params.slug,
        status: "published",
      }).lean(),

      Service.find({
        status: "published",
      })
        .select("title slug category")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    if (!service) {
      return res.status(404).render("user/error", {
        message: "Service not found.",
      });
    }

    res.render("user/serviceDetails", {
      service,
      services,
    });
  } catch (error) {
    next(error);
  }
});

// Gallery Page
router.get("/gallery", async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = 9;
    const skip = (page - 1) * limit;

    const [gallery, totalGallery] = await Promise.all([
      Gallery.find({
        is_active: true,
      })
        .sort({ sort_order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Gallery.countDocuments({
        is_active: true,
      }),
    ]);

    const totalPages = Math.ceil(totalGallery / limit);

    // If requested page does not exist
    if (page > totalPages && totalPages > 0) {
      return res.redirect("/gallery?page=" + totalPages);
    }

    res.render("user/gallery", {
      gallery,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("GALLERY PAGE ERROR:", error);
    next(error);
  }
});
router.get("/tips", async (req, res, next) => {
  try {
    const tips = await Tips.find({ is_active: true })
      .sort({ sort_order: 1, createdAt: -1 })
      .lean();

    res.render("user/tips", {
      tips,
    });
  } catch (error) {
    console.error("TIPS PAGE ERROR:", error);
    next(error);
  }
});
router.get("/contact", (req, res) => {
  res.render("user/contact");
});

// Blog Page
router.get("/blog", async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = 6;
    const skip = (page - 1) * limit;

    const [blogs, totalBlogs] = await Promise.all([
      Blog.find({
        status: "published",
      })
        .select("title slug content imageUrl author createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Blog.countDocuments({
        status: "published",
      }),
    ]);

    const totalPages = Math.ceil(totalBlogs / limit);

    // If someone enters a page number that doesn't exist
    if (page > totalPages && totalPages > 0) {
      return res.redirect("/blog?page=" + totalPages);
    }

    res.render("user/blog", {
      blogs,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("BLOG PAGE ERROR:", error);
    next(error);
  }
});

// Blog Details Page
router.get("/blog/:slug", async (req, res, next) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      status: "published",
    }).lean();

    if (!blog) {
      return res.status(404).render("user/error", {
        message: "Blog not found.",
      });
    }

    blog.content = sanitizeHtml(blog.content, {
      allowedTags: [
        "a",
        "blockquote",
        "br",
        "em",
        "h1",
        "h2",
        "h3",
        "li",
        "ol",
        "p",
        "s",
        "span",
        "strong",
        "u",
        "ul",
      ],
      allowedAttributes: {
        a: ["href", "name", "target", "rel"],
        h1: ["class"],
        h2: ["class"],
        h3: ["class"],
        li: ["class"],
        ol: ["class"],
        p: ["class"],
        span: ["class"],
        ul: ["class"],
      },
      allowedClasses: {
        h1: ["ql-align-center", "ql-align-right", "ql-align-justify"],
        h2: ["ql-align-center", "ql-align-right", "ql-align-justify"],
        h3: ["ql-align-center", "ql-align-right", "ql-align-justify"],
        li: ["ql-indent-1", "ql-indent-2", "ql-indent-3"],
        ol: ["ql-indent-1", "ql-indent-2", "ql-indent-3"],
        p: ["ql-align-center", "ql-align-right", "ql-align-justify"],
        span: ["ql-ui"],
        ul: ["ql-indent-1", "ql-indent-2", "ql-indent-3"],
      },
    });

    res.render("user/blogDetails", {
      blog,
    });
  } catch (error) {
    console.error("BLOG DETAILS ERROR:", error);
    next(error);
  }
});

function getSiteUrl(req) {
  const configured = (process.env.SITE_URL || "").replace(/\/$/, "");
  if (configured) return configured;
  return `${req.protocol}://${req.get("host")}`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function sitemapUrlEntry({ loc, lastmod, changefreq, priority }) {
  return [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${escapeXml(lastmod)}</lastmod>` : null,
    changefreq ? `    <changefreq>${escapeXml(changefreq)}</changefreq>` : null,
    priority ? `    <priority>${escapeXml(priority)}</priority>` : null,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

// Dynamic sitemap (static pages + published blogs)
router.get("/sitemap.xml", async (req, res, next) => {
  try {
    const siteUrl = getSiteUrl(req);
    const blogs = await Blog.find({ status: "published" })
      .select("slug updatedAt createdAt")
      .sort({ updatedAt: -1 })
      .lean();

    const staticPages = [
      { path: "/", changefreq: "weekly", priority: "1.0" },
      { path: "/about", changefreq: "monthly", priority: "0.8" },
      { path: "/services", changefreq: "weekly", priority: "0.9" },
      { path: "/gallery", changefreq: "weekly", priority: "0.7" },
      { path: "/blog", changefreq: "daily", priority: "0.9" },
      { path: "/tips", changefreq: "weekly", priority: "0.6" },
      { path: "/contact", changefreq: "monthly", priority: "0.7" },
    ];

    const urls = [
      ...staticPages.map((page) =>
        sitemapUrlEntry({
          loc: `${siteUrl}${page.path}`,
          changefreq: page.changefreq,
          priority: page.priority,
        }),
      ),
      ...blogs.map((blog) =>
        sitemapUrlEntry({
          loc: `${siteUrl}/blog/${blog.slug}`,
          lastmod: new Date(blog.updatedAt || blog.createdAt)
            .toISOString()
            .split("T")[0],
          changefreq: "weekly",
          priority: "0.8",
        }),
      ),
    ];

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls,
      "</urlset>",
    ].join("\n");

    res
      .type("application/xml")
      .set("Cache-Control", "public, max-age=3600")
      .send(xml);
  } catch (error) {
    console.error("SITEMAP ERROR:", error);
    next(error);
  }
});

router.get("/robots.txt", (req, res) => {
  const siteUrl = getSiteUrl(req);
  res
    .type("text/plain")
    .send(
      [
        "User-agent: *",
        "Allow: /",
        "Disallow: /admin",
        "Disallow: /api",
        `Sitemap: ${siteUrl}/sitemap.xml`,
        "",
      ].join("\n"),
    );
});

module.exports = router;
