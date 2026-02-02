const Listing = require("../Models/listing.model");
const createListing = (req, res) => {
  const {
    title,
    description,
    price,
    unit,
    quantity,
    category,
    location,
    delivery,
    images,
  } = req.body;

  // Validate required fields
  if (
    !title ||
    !description ||
    !price ||
    !unit ||
    !quantity ||
    !category ||
    !location ||
    !delivery
  ) {
    return res
      .status(400)
      .json({ status: false, message: "All fields are required" });
  }

  Listing.create({
    title,
    description,
    price,
    unit,
    quantity,
    category,
    location,
    delivery,
    images: images || [],
    seller: req.user._id,
  })
    .then((listing) => {
      res.status(201).json({
        status: true,
        message: "Listing created successfully",
        listing,
      });
    })
    .catch((err) => {
      console.error("Create Listing Error:", err);
      res
        .status(500)
        .json({ status: false, message: "Failed to create listing" });
    });
};

// ✅ GET: All Listings (for Marketplace)
const getAllListings = (req, res) => {
  Listing.find()
    .populate("seller", "firstName lastName") 
    .then((listings) => {
      res.status(200).json({
        status: true,
        count: listings.length,
        listings,
      });
    })
    .catch((err) => {
      console.error("Error fetching listings:", err);
      res.status(500).json({
        status: false,
        message: "Server error while fetching listings",
      });
    });
};

// ✅ GET: Listing by ID
const getListingById = (req, res) => {
  const listingId = req.params.id;

  if (!listingId.match(/^[0-9a-fA-F]{24}$/)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid listing ID" });
  }

  Listing.findById(listingId)
    .populate("seller", "firstName lastName verified bio")
    .then((listing) => {
      if (!listing) {
        return res
          .status(404)
          .json({ status: false, message: "Listing not found" });
      }

      const formattedListing = {
        ...listing.toObject(),
        seller: listing.seller
          ? {
              name: `${listing.seller.firstName} ${listing.seller.lastName}`,
              verified: listing.seller.verified,
              bio: listing.seller.bio,
            }
          : {
              name: "Unknown",
              verified: false,
              bio: "",
            },
      };

      res.status(200).json({ status: true, listing: formattedListing });
    })
    .catch((err) => {
      console.error("Error fetching listing by ID:", err);
      res
        .status(500)
        .json({
          status: false,
          message: "Server error while fetching listing",
        });
    });
};

// ✅ PUT: Update Listing
const updateListing = (req, res) => {
  const listingId = req.params.id;

  if (!listingId.match(/^[0-9a-fA-F]{24}$/)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid listing ID" });
  }

  Listing.findById(listingId)
    .then((listing) => {
      if (!listing) {
        return res
          .status(404)
          .json({ status: false, message: "Listing not found" });
      }

      // Optional: Only allow owner to update
      if (listing.seller.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ status: false, message: "Not authorized to update this listing" });
      }

      // Update fields
      Object.assign(listing, req.body);

      return listing.save();
    })
    .then((updated) => {
      res.status(200).json({
        status: true,
        message: "Listing updated successfully",
        listing: updated,
      });
    })
    .catch((err) => {
      console.error("Update Listing Error:", err);
      res
        .status(500)
        .json({ status: false, message: "Failed to update listing" });
    });
};

// ✅ DELETE: Delete Listing
const deleteListing = (req, res) => {
  const listingId = req.params.id;

  Listing.findById(listingId)
    .then((listing) => {
      if (!listing) {
        return res
          .status(404)
          .json({ status: false, message: "Listing not found" });
      }

      // ✅ Only allow seller to delete their own listing
      if (listing.seller.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({
            status: false,
            message: "Not authorized to delete this listing",
          });
      }

      return Listing.findByIdAndDelete(listingId);
    })
    .then((deleted) => {
      if (deleted) {
        return res.status(200).json({
          status: true,
          message: "Listing deleted successfully",
        });
      }
    })
    .catch((err) => {
      console.error("Delete Listing Error:", err);
      if (!res.headersSent) {
        res.status(500).json({
          status: false,
          message: "Failed to delete listing",
        });
      }
    });
};




module.exports = {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
};
