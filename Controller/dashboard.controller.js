const dashboardOverview = async (req, res) => {
  try {
    console.log("Dashboard accessed by user:", req.user.role);

    let stats = {};

    if (req.user.role === "ADMIN") {
      stats = {
        totalUsers: 120,
        activeListings: 45,
        transactions: 310,
      };
    }

    if (req.user.role === "FARMER") {
      stats = {
        myListings: 8,
        orders: 23,
        revenue: 154000,
      };
    }

    if (req.user.role === "BUYER") {
      stats = {
        orders: 12,
        suppliers: 6,
        totalSpend: 98000,
      };
    }

    if (req.user.role === "TRANSPORTER") {
      stats = {
        deliveries: 19,
        activeJobs: 3,
        earnings: 67000,
      };
    }

    res.status(200).json({
      message: "Dashboard loaded",
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        role: req.user.role,
      },
      stats,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { dashboardOverview };
