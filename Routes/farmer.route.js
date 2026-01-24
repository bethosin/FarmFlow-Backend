const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../Middlewares/auth.middleware");
const {
  farmerOverview,
  getMyListings,
  getFarmerOrders,
  getFarmerEarnings,
} = require("../Controller/farmer.controller");

router.get("/overview", protect, authorize("FARMER"), farmerOverview);
router.get("/my-listings", protect, authorize("FARMER"), getMyListings);
router.get("/orders", protect, authorize("FARMER"), getFarmerOrders);
router.get("/earnings", protect, authorize("FARMER"), getFarmerEarnings);

module.exports = router;
