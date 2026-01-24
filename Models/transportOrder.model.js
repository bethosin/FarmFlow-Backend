const mongoose = require("mongoose");

const transporterOrderSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Picked Up", "In Transit", "Delivered"],
      default: "Pending",
    },
    deliveryFee: {
      type: Number,
      required: true,
      default: 0,
    },
    deliveryDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("TransporterOrder", transporterOrderSchema, "TransporterOrder");
