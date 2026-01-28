const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadFile = (req, res) => {
  let file = req.body.file;

  if (!file) {
    return res.status(400).json({ status: false, message: "No file provided" });
  }

  // ✅ Strip data URI prefix
  const base64Pattern = /^data:image\/\w+;base64,/;
  if (base64Pattern.test(file)) {
    file = file.replace(base64Pattern, "");
  } else {
    return res
      .status(400)
      .json({ status: false, message: "Invalid base64 format" });
  }

  // ✅ Upload using upload_stream
  const stream = cloudinary.uploader.upload_stream(
    { resource_type: "image" },
    (err, result) => {
      if (err) {
        console.error("Cloudinary error:", err);
        return res
          .status(500)
          .json({ status: false, message: "Upload failed" });
      }

      return res.status(200).json({
        status: true,
        message: "File uploaded successfully",
        imageUrl: result.secure_url,
      });
    },
  );

  // ✅ Convert string to buffer and pipe to upload_stream
  const buffer = Buffer.from(file, "base64");
  stream.end(buffer);
};

module.exports = { uploadFile };
