const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../Middlewares/auth.middleware");
const {
  transporterOverview,
  getDeliveries,
  getTransporterEarnings,
} = require("../Controller/transport.controller");

router.get("/overview", protect, authorize("TRANSPORTER"), transporterOverview);
router.get("/deliveries", protect, authorize("TRANSPORTER"), getDeliveries);
router.get(
  "/transport-earnings",
  protect,
  authorize("TRANSPORTER"),
  getTransporterEarnings
);

module.exports = router;
