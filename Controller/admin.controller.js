const userModel = require("../Models/user.model");
const Listing = require("../Models/listing.model");
const BuyerOrder = require("../Models/buyerOrder.model");

const adminOverview = (req, res) => {
  Promise.all([
    userModel.countDocuments(), // Total users
    Listing.countDocuments(), // Total listings
    BuyerOrder.countDocuments(), // Total transactions
  ])
    .then(([totalUsers, activeListings, transactions]) => {
      res.status(200).json({
        status: true,
        message: "Admin overview",
        stats: {
          totalUsers,
          activeListings,
          transactions,
        },
      });
    })
    .catch((err) => {
      console.error("Admin Overview Error:", err);
      res.status(500).json({
        status: false,
        message: "Error fetching admin overview",
      });
    });
};

const getAllUsers = (req, res) => {
  userModel
    .find()
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(50)
    .then((users) => {
      res.status(200).json({ status: true, users });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: false, message: "Server error" });
    });
};

const getAdminListings = (req, res) => {
  res.status(200).json({
    status: true,
    listings: [], // later from Listing model
  });
};

const getAdminTransactions = (req, res) => {
  res.status(200).json({
    status: true,
    transactions: [], // later from Transaction model
  });
};

module.exports = {
  adminOverview,
  getAllUsers,
  getAdminListings,
  getAdminTransactions,
};
