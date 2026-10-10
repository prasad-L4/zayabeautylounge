const Tips = require("../models/Tips");

function normalizeInstagramUrl(value) {
  if (typeof value !== "string") {
    return null;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(value);
  } catch {
    return null;
  }

  if (
    !["instagram.com", "www.instagram.com"].includes(
      parsedUrl.hostname.toLowerCase(),
    ) ||
    !["http:", "https:"].includes(parsedUrl.protocol) ||
    parsedUrl.username ||
    parsedUrl.password ||
    parsedUrl.port
  ) {
    return null;
  }

  const match = parsedUrl.pathname.match(
    /^\/(reel|reels|p|tv)\/([A-Za-z0-9_-]+)\/?$/,
  );
  if (!match) {
    return null;
  }

  const type = match[1] === "reels" ? "reel" : match[1];
  return `https://www.instagram.com/${type}/${match[2]}/`;
}

function parseSortOrder(value, fallback = 0) {
  if (value === undefined || value === "") {
    return fallback;
  }

  const order = Number(value);
  return Number.isFinite(order) && order >= 0 ? order : null;
}

function invalidReelResponse(res) {
  return res.status(400).json({
    success: false,
    message:
      "Enter a valid Instagram Reel, post, or video link (instagram.com/reel/..., /p/..., or /tv/...).",
  });
}

function validateTitle(value) {
  if (value !== undefined && typeof value !== "string") {
    return false;
  }
  return value === undefined || value.trim().length <= 120;
}

const createTip = async (req, res) => {
  try {
    if (!validateTitle(req.body.title)) {
      return res.status(400).json({
        success: false,
        message: "Title must be 120 characters or fewer.",
      });
    }

    const reelUrl = normalizeInstagramUrl(req.body.reelUrl);
    if (!reelUrl) {
      return invalidReelResponse(res);
    }

    const sortOrder = parseSortOrder(req.body.sort_order);
    if (sortOrder === null) {
      return res.status(400).json({
        success: false,
        message: "Sort order must be a non-negative number.",
      });
    }

    const tip = await Tips.create({
      title: (req.body.title || "").trim(),
      reelUrl,
      sort_order: sortOrder,
      is_active:
        req.body.is_active === undefined
          ? true
          : req.body.is_active === true || req.body.is_active === "true",
    });

    return res.status(201).json({
      success: true,
      message: "Instagram Reel added successfully.",
      tip,
    });
  } catch (error) {
    console.error("Create Instagram tip error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add Instagram Reel.",
      error: error.message,
    });
  }
};

const getAllTips = async (req, res) => {
  try {
    const tips = await Tips.find().sort({ sort_order: 1, createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: tips.length,
      tips,
    });
  } catch (error) {
    console.error("Get Instagram tips error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Instagram Reels.",
      error: error.message,
    });
  }
};

const updateTip = async (req, res) => {
  try {
    if (!validateTitle(req.body.title)) {
      return res.status(400).json({
        success: false,
        message: "Title must be 120 characters or fewer.",
      });
    }

    const tip = await Tips.findById(req.params.id);
    if (!tip) {
      return res.status(404).json({ success: false, message: "Reel not found." });
    }

    if (req.body.reelUrl !== undefined) {
      const reelUrl = normalizeInstagramUrl(req.body.reelUrl);
      if (!reelUrl) {
        return invalidReelResponse(res);
      }
      tip.reelUrl = reelUrl;
    }

    if (req.body.title !== undefined) {
      tip.title = req.body.title.trim();
    }

    if (req.body.sort_order !== undefined) {
      const sortOrder = parseSortOrder(req.body.sort_order, tip.sort_order);
      if (sortOrder === null) {
        return res.status(400).json({
          success: false,
          message: "Sort order must be a non-negative number.",
        });
      }
      tip.sort_order = sortOrder;
    }

    if (req.body.is_active !== undefined) {
      tip.is_active = req.body.is_active === true || req.body.is_active === "true";
    }

    await tip.save();
    return res.status(200).json({
      success: true,
      message: "Instagram Reel updated successfully.",
      tip,
    });
  } catch (error) {
    console.error("Update Instagram tip error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Reel ID.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to update Instagram Reel.",
      error: error.message,
    });
  }
};

const toggleTipStatus = async (req, res) => {
  try {
    const tip = await Tips.findById(req.params.id);
    if (!tip) {
      return res.status(404).json({ success: false, message: "Reel not found." });
    }

    tip.is_active = !tip.is_active;
    await tip.save();
    return res.status(200).json({
      success: true,
      message: tip.is_active ? "Reel activated." : "Reel deactivated.",
      is_active: tip.is_active,
    });
  } catch (error) {
    console.error("Toggle Instagram tip status error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Reel ID.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to update Reel status.",
      error: error.message,
    });
  }
};

const deleteTip = async (req, res) => {
  try {
    const tip = await Tips.findByIdAndDelete(req.params.id);
    if (!tip) {
      return res.status(404).json({ success: false, message: "Reel not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Instagram Reel deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Instagram tip error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Reel ID.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to delete Instagram Reel.",
      error: error.message,
    });
  }
};

module.exports = {
  createTip,
  getAllTips,
  updateTip,
  toggleTipStatus,
  deleteTip,
};