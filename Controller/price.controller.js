const Price = require("../Models/price.model");

const getAllPrices = (req, res) => {
  Price.find()
    .sort({ updatedAt: -1 })
    .then((prices) => {
      const formatted = prices.map((p) => ({
        id: p._id,
        product: p.product,
        category: p.category,
        unit: p.unit,
        averagePrice: p.averagePrice,
        lastUpdated: p.updatedAt,
      }));
      res.status(200).json({ status: true, prices: formatted });
    })
    .catch((err) => {
      console.error("Get Prices Error:", err);
      res.status(500).json({ status: false, message: "Server error" });
    });
};

module.exports = { getAllPrices };
