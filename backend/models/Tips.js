const mongoose = require("mongoose");

const tipsSchema = new mongoose.Schema(
  {
    title: { type: String, default: "", trim: true, maxlength: 120 },
    reelUrl: { type: String, required: true, trim: true },
    sort_order: { type: Number, default: 0, min: 0 },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Tips", tipsSchema);