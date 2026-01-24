const Listing = require("../Models/listing.model");
const Order = require("../Models/farmerOrder.model");


const farmerOverview = (req, res) => {
  const sellerId = req.user._id;

  let stats = {};
  let recentListings = [];
  let recentOrders = [];

  // Count Listings
  Listing.find({ seller: sellerId })
    .then((listings) => {
      stats.myListings = listings.length;
      recentListings = listings
        .slice(-2) 
        .reverse()
        .map((l) => ({
          _id: l._id,
          title: l.title,
          price: l.price,
          unit: l.unit,
          status: "Available", // Optional: you can add real status later
        }));

      // Orders for this farmer (seller)
      return Order.find({ seller: sellerId })
        .populate("buyer", "firstName lastName")
        .populate("listing", "title");
    })
    .then((orders) => {
      stats.orders = orders.length;
      stats.revenue = orders.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
      );

      recentOrders = orders
        .slice(-2)
        .reverse()
        .map((o) => ({
          _id: o._id,
          item: o.listing?.title || "Item",
          buyer: `${o.buyer?.firstName ?? "Buyer"} ${o.buyer?.lastName ?? ""}`,
          status: o.status,
        }));

      res.status(200).json({
        status: true,
        message: "Farmer overview",
        stats,
        recentListings,
        recentOrders,
      });
    })
    .catch((err) => {
      console.error("Farmer overview error:", err);
      res.status(500).json({
        status: false,
        message: "Failed to fetch farmer overview",
      });
    });
};

const getMyListings = (req, res) => {
  const sellerId = req.user._id;

  Listing.find({ seller: sellerId })
    .sort({ createdAt: -1 }) 
    .then((listings) => {
      res.status(200).json({
        status: true,
        listings,
      });
    })
    .catch((err) => {
      console.error("Get My Listings Error:", err);
      res.status(500).json({
        status: false,
        message: "Failed to fetch listings",
      });
    });
};

const getFarmerOrders = (req, res) => {
  const sellerId = req.user._id;

  Listing.find({ seller: sellerId })
    .select("_id") // Only get IDs of listings
    .then((listings) => {
      const listingIds = listings.map((l) => l._id);

      return Order.find({ listing: { $in: listingIds } })
        .populate("listing", "title price")
        .populate("buyer", "firstName lastName email")
        .sort({ createdAt: -1 });
    })
    .then((orders) => {
      res.status(200).json({
        status: true,
        orders,
      });
    })
    .catch((err) => {
      console.error("Get Farmer Orders Error:", err);
      res.status(500).json({
        status: false,
        message: "Failed to fetch orders",
      });
    });
};

const getFarmerEarnings = (req, res) => {
  const sellerId = req.user._id;

  // Step 1: Find listings by the current farmer
  Listing.find({ seller: sellerId })
    .select("_id")
    .then((listings) => {
      const listingIds = listings.map((l) => l._id);

      // Step 2: Define start of current month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      // Step 3: Get all completed orders for the farmer
      return Order.find({
        listing: { $in: listingIds },
        status: "Completed",
      })
        .populate("listing", "price")
        .then((orders) => {
          // Step 4: Calculate total and monthly earnings
          let total = 0;
          let thisMonth = 0;

          orders.forEach((order) => {
            const price = order?.listing?.price ?? 0;
            total += price;

            const createdAt = new Date(order.createdAt);
            if (createdAt >= startOfMonth) {
              thisMonth += price;
            }
          });

          res.status(200).json({
            status: true,
            earnings: {
              total,
              thisMonth,
            },
          });
        });
    })
    .catch((err) => {
      console.error("Get Farmer Earnings Error:", err);
      res.status(500).json({
        status: false,
        message: "Failed to fetch earnings",
      });
    });
};

module.exports = {
  farmerOverview,
  getMyListings,
  getFarmerOrders,
  getFarmerEarnings,
};
