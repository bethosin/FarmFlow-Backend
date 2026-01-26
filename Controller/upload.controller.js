const cloudinary = require("cloudinary").v2;
require("dotenv").config();


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadFile = (req, res) => {
  const file = req.body.file;

  if (!file) {
    return res.status(400).json({ status: false, message: "No file provided" });
  }

  cloudinary.uploader.upload(file, (err, result) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(500).json({ status: false, message: "Upload failed" });
    }

    return res.status(200).json({
      status: true,
      message: "File uploaded successfully",
      imageUrl: result.secure_url,
    });
  });
};

module.exports = { uploadFile };
