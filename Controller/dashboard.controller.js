const User = require("../Models/user.model");
const Listing = require("../Models/listing.model");
const BuyerOrder = require("../Models/buyerOrder.model");
const TransporterOrder = require("../Models/transportOrder.model");

const dashboardOverview = (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;
  let stats = {};

  if (role === "ADMIN") {
    Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      BuyerOrder.countDocuments(),
    ])
      .then(([totalUsers, activeListings, transactions]) => {
        stats = { totalUsers, activeListings, transactions };
        return respond();
      })
      .catch((err) => handleError(err, res));
  }

  if (role === "FARMER") {
    Promise.all([
      Listing.countDocuments({ seller: userId }),
      BuyerOrder.find().populate("listing"),
    ])
      .then(([myListings, allOrders]) => {
        const myOrders = allOrders.filter(
          (o) => o.listing?.seller?.toString() === userId.toString(),
        );

        const revenue = myOrders.reduce(
          (sum, o) => sum + (o.totalAmount || 0),
          0,
        );

        stats = {
          myListings,
          orders: myOrders.length,
          revenue,
        };

        return respond();
      })
      .catch((err) => handleError(err, res));
  }

  if (role === "BUYER") {
    BuyerOrder.find({ buyer: userId })
      .populate("listing")
      .then((orders) => {
        const suppliers = new Set(
          orders.map((o) => o.listing?.seller?.toString()),
        ).size;

        const totalSpend = orders.reduce(
          (sum, o) => sum + (o.totalAmount || 0),
          0,
        );

        stats = {
          orders: orders.length,
          suppliers,
          totalSpend,
        };

        return respond();
      })
      .catch((err) => handleError(err, res));
  }

  if (role === "TRANSPORTER") {
    Promise.all([
      TransporterOrder.countDocuments({ transporter: userId }),
      TransporterOrder.countDocuments({
        transporter: userId,
        status: "In Transit",
      }),
      TransporterOrder.find({
        transporter: userId,
        status: "Delivered",
      }),
    ])
      .then(([deliveries, activeJobs, deliveredOrders]) => {
        const earnings = deliveredOrders.reduce(
          (sum, order) => sum + (order.deliveryFee || 0),
          0,
        );

        stats = {
          deliveries,
          activeJobs,
          earnings,
        };

        return respond();
      })
      .catch((err) => handleError(err, res));
  }

  // Helpers
  function respond() {
    res.status(200).json({
      message: "Dashboard loaded",
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        role: req.user.role,
      },
      stats,
    });
  }

  function handleError(err, res) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { dashboardOverview };
