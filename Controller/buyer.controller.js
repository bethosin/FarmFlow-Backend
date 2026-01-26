const BuyerOrder = require("../Models/buyerOrder.model");
const Listing = require("../Models/listing.model");



// ✅ Overview
const buyerOverview = (req, res) => {
  const buyerId = req.user._id;

  BuyerOrder.find({ buyer: buyerId })
    .populate({
      path: "listing",
      select: "title seller",
      populate: {
        path: "seller",
        select: "firstName lastName location verified",
      },
    })
    .then((orders) => {
      const ordersSummary = {
        totalOrders: orders.length,
        pending: orders.filter((o) => o.status === "Pending").length,
        inTransit: orders.filter((o) => o.status === "In Transit").length,
        completed: orders.filter((o) => o.status === "Completed").length,
      };

      const totalSpend = orders.reduce(
        (sum, order) => sum + (order.totalAmount ?? 0),
        0,
      );

      const recentOrders = orders
        .slice(-5)
        .reverse()
        .map((order) => ({
          _id: order._id,
          item: order.listing?.title || "Unknown",
          amount: order.totalAmount ?? 0,
          status: order.status,
        }));

      const supplierMap = new Map();

      orders.forEach((order) => {
        const seller = order.listing?.seller;
        if (seller && !supplierMap.has(seller._id.toString())) {
          supplierMap.set(seller._id.toString(), {
            _id: seller._id,
            name: `${seller.firstName} ${seller.lastName}`,
            location: seller.location || "Unknown",
            verified: seller.verified || false,
          });
        }
      });

      const suppliers = Array.from(supplierMap.values());

      res.status(200).json({
        status: true,
        ordersSummary,
        recentOrders,
        suppliers,
        totalSpend, 
      });
    })
    .catch((err) => {
      console.error("Buyer Overview Error:", err);
      res.status(500).json({ status: false, message: "Server error" });
    });
};


// ✅ All Orders
const placeBuyerOrder = (req, res) => {
  const buyerId = req.user._id;
  const { listingId, quantity } = req.body;

  if (!listingId || !quantity) {
    return res.status(400).json({ message: "All fields are required" });
  }

  Listing.findById(listingId)
    .then((listing) => {
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }

      if (listing.quantity < quantity) {
        return res.status(400).json({
          message: `Only ${listing.quantity} units available`,
        });
      }

      const totalAmount = listing.price * quantity;

      BuyerOrder.create({
        buyer: buyerId,
        listing: listing._id,
        quantity,
        totalAmount,
      })
        .then((newOrder) => {
          listing.quantity -= quantity;
          listing
            .save()
            .then(() => {
              res.status(201).json({
                status: true,
                message: "Order placed successfully",
                order: newOrder,
              });
            })
            .catch((err) => {
              console.error("Listing update error:", err);
              res.status(500).json({
                status: false,
                message: "Failed to update listing quantity",
              });
            });
        })
        .catch((err) => {
          console.error("Order creation error:", err);
          res.status(500).json({
            status: false,
            message: "Failed to place order",
          });
        });
    })
    .catch((err) => {
      console.error("Find listing error:", err);
      res.status(500).json({
        status: false,
        message: "Server error",
      });
    });
};
const getBuyerOrders = (req, res) => {
  BuyerOrder.find({ buyer: req.user._id })
    .populate("listing", "title")
    .sort({ createdAt: -1 })
    .then((orders) => {
      const formatted = orders.map((order) => ({
        _id: order._id,
        listing: order.listing,
        quantity: order.quantity,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
      }));

      res.status(200).json({ status: true, orders: formatted });
    })
    .catch((err) => {
      console.error("Buyer Orders Error:", err);
      res.status(500).json({ status: false, message: "Error fetching orders" });
    });
};


// ✅ Suppliers
const getBuyerSuppliers = (req, res) => {
  BuyerOrder.find({ buyer: req.user._id })
    .populate({
      path: "listing",
      select: "seller",
      populate: {
        path: "seller",
        select: "firstName lastName", 
      },
    })
    .then((orders) => {
      const supplierMap = new Map();

      orders.forEach((order) => {
        const seller = order.listing?.seller;
        if (seller && !supplierMap.has(seller._id.toString())) {
          supplierMap.set(seller._id.toString(), {
            _id: seller._id,
            name: `${seller.firstName} ${seller.lastName}`,
          });
        }
      });

      const suppliers = Array.from(supplierMap.values());

      res.status(200).json({ status: true, suppliers });
    })
    .catch((err) => {
      console.error("Buyer Suppliers Error:", err);
      res
        .status(500)
        .json({ status: false, message: "Error fetching suppliers" });
    });
};



module.exports = {
  buyerOverview,
  placeBuyerOrder,
  getBuyerOrders,
  getBuyerSuppliers,
};
