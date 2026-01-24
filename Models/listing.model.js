const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,
    unit: String,
    quantity: Number,
    category: String,
    location: String,
    delivery: String,
    images: [String],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Listing", listingSchema, "Listing");
