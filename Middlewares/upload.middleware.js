// middleware/upload.js
const multer = require("multer");

const storage = multer.memoryStorage(); // We'll upload to Cloudinary manually
const upload = multer({ storage });

module.exports = upload;
