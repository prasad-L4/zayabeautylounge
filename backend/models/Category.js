const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    title: { type: String, default: "", trim: true },
    alt_text: { type: String, default: "", trim: true },
    image: { type: String, required: true },
    sort_order: { type: Number, default: 0, min: 0 },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Category", categorySchema);