const express = require("express");
const router = express.Router();
const { protect } = require("../Middlewares/auth.middleware");

const {
  getListingById,
  getAllListings,
  createListing,
} = require("../Controller/listing.controller");

router.post("/", protect, createListing);

router.get("/:id", protect, getListingById);
router.get("/", getAllListings);

module.exports = router;
