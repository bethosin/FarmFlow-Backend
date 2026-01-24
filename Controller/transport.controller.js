const TransporterOrder = require("../Models/transportOrder.model");

const transporterOverview = (req, res) => {
  const transporterId = req.user._id;

  TransporterOrder.find({ transporter: transporterId })
    .then((orders) => {
      const deliveries = orders.length;
      const activeJobs = orders.filter((o) => o.status !== "Delivered").length;
      const earnings = orders
        .filter((o) => o.status === "Delivered")
        .reduce((sum, o) => sum + o.deliveryFee, 0);

      res.status(200).json({
        status: true,
        stats: {
          deliveries,
          activeJobs,
          earnings,
        },
      });
    })
    .catch((err) => {
      console.error("Overview Error:", err);
      res.status(500).json({ status: false, message: "Server error" });
    });
};

const getDeliveries = (req, res) => {
  TransporterOrder.find({ transporter: req.user._id })
    .populate("listing", "title location")
    .populate("buyer", "firstName lastName")
    .then((deliveries) => {
      res.status(200).json({ status: true, deliveries });
    })
    .catch((err) => {
      console.error("Deliveries Error:", err);
      res
        .status(500)
        .json({ status: false, message: "Failed to fetch deliveries" });
    });
};


const getTransporterEarnings = (req, res) => {
  TransporterOrder.find({ transporter: req.user._id })
    .then((orders) => {
      const deliveries = orders.length;
      const activeJobs = orders.filter((o) => o.status !== "Delivered").length;
      const earnings = orders
        .filter((o) => o.status === "Delivered")
        .reduce((sum, o) => sum + o.deliveryFee, 0);

      res.status(200).json({
        status: true,
        stats: {
          deliveries,
          activeJobs,
          earnings,
        },
      });
    })
    .catch((err) => {
      console.error("Earnings Error:", err);
      res.status(500).json({ status: false, message: "Server error" });
    });
};

module.exports = {
  transporterOverview,
  getDeliveries,
  getTransporterEarnings,
};
