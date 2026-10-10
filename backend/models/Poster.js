const mongoose = require("mongoose");

const posterSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    image: { type: String, required: true },
    alt_text: { type: String, default: "" },
    sort_order: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Poster", posterSchema);