const express = require("express");
const router = express.Router();
const { protect } = require("../Middlewares/auth.middleware");

const {
  getListingById,
  getAllListings,
  createListing,

  deleteListing,
} = require("../Controller/listing.controller");

router.post("/", protect, createListing);

router.get("/:id", protect, getListingById);
router.get("/",  getAllListings);


router.delete("/:id", protect, deleteListing);

module.exports = router;
