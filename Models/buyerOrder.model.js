const mongoose = require("mongoose");

const buyerOrderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Transit", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

const BuyerOrder = mongoose.model("BuyerOrders", buyerOrderSchema, "BuyerOrders");

module.exports = BuyerOrder;
