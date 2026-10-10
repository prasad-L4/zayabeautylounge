const mongoose = require("mongoose");
const slugify = require("slugify");

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    category: {
      type: String,
      trim: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    price: {
      type: Number,
      min: 0,
      default: null,
    },

    duration: {
      type: Number,
      min: 1,
      default: null,
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    // ==============================
    // SEO
    // ==============================
    metaTitle: {
      type: String,
      trim: true,
      default: "",
    },

    metaDescription: {
      type: String,
      trim: true,
      default: "",
    },

    tags: {
      type: [String],
      default: [],
      set: (tags) => {
        if (!Array.isArray(tags)) return [];

        return tags.map((tag) => tag.trim()).filter(Boolean);
      },
    },

    // ==============================
    // IMAGES
    // ==============================
    images: {
      type: [String],
      required: true,
      validate: {
        validator: function (images) {
          return images && images.length > 0;
        },
        message: "At least one service image is required.",
      },
    },

    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
    },
  },
  {
    timestamps: true,
  },
);

// Generate slug automatically
serviceSchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
});

module.exports = mongoose.model("Service", serviceSchema);
