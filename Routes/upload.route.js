const express = require("express");
const { uploadFile } = require("../Controller/upload.controller");


const router = express.Router();

router.post("/", uploadFile);



module.exports = router;
