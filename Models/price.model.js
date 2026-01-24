const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema(
  {
    product: { type: String, required: true },
    category: { type: String, enum: ["Crop", "Livestock"], required: true },
    unit: { type: String, required: true },
    averagePrice: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Price", priceSchema, "Price");
