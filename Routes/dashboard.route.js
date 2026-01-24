const express = require("express");
const { protect } = require("../Middlewares/auth.middleware");
const { dashboardOverview } = require("../Controller/dashboard.controller");


const router = express.Router();

// Protected dashboard route
router.get("/", protect, dashboardOverview);

module.exports = router;
