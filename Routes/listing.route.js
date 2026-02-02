const express = require("express");
const router = express.Router();
const { protect } = require("../Middlewares/auth.middleware");

const {
  getListingById,
  getAllListings,
  createListing,
  updateListing,
  deleteListing,
} = require("../Controller/listing.controller");

router.post("/", protect, createListing);

router.get("/:id", protect, getListingById);
router.get("/", protect, getAllListings);

router.put("/:id", protect, updateListing);

router.delete("/:id", protect, deleteListing);

module.exports = router;
