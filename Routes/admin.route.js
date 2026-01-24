const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../Middlewares/auth.middleware");
const {
  adminOverview,
  getAllUsers,
  getAdminListings,
  getAdminTransactions,
} = require("../Controller/admin.controller");

router.get("/overview", protect, authorize("ADMIN"), adminOverview);
router.get("/users", protect, authorize("ADMIN"), getAllUsers);
router.get("/listings", protect, authorize("ADMIN"), getAdminListings);
router.get("/transactions", protect, authorize("ADMIN"), getAdminTransactions);

module.exports = router;
