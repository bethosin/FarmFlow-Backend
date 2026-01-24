const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../Middlewares/auth.middleware");
const {
  buyerOverview,
  getBuyerOrders,
  getBuyerSuppliers,
  placeBuyerOrder,
} = require("../Controller/buyer.controller");

router.get("/overview", protect, authorize("BUYER"), buyerOverview);
router.get("/orders", protect, authorize("BUYER"), getBuyerOrders);
router.get("/suppliers", protect, authorize("BUYER"), getBuyerSuppliers);
router.post("/place-orders", protect, authorize("BUYER"), placeBuyerOrder);

module.exports = router;
