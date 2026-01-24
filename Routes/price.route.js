const express = require("express");
const { getAllPrices } = require("../Controller/price.controller");
const router = express.Router();


router.get("/", getAllPrices);

module.exports = router;
