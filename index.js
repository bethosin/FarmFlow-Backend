const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoute = require("./Routes/auth.route.js");
const dashboardRoute = require("./Routes/dashboard.route.js")
const adminRoute = require("./Routes/admin.route.js");
const farmerRoute = require("./Routes/farmer.route.js");
const buyerRoute = require("./Routes/buyer.route.js");
const transporterRoute = require("./Routes/transport.route.js");
const listingRoute = require("./Routes/listing.route.js");  
const priceRoute = require("./Routes/price.route.js");
const uploadRoute  = require("./Routes/upload.route.js");


require("dotenv").config();
const cors = require("cors");

const PORT = process.env.PORT || 5501;

app.post("/api/upload", (req, res) => {
  res.send("Upload route works!");
});




const allowedOrigins = [
  "http://localhost:5173",
  "https://farm-flow-frontend-asit.vercel.app", 
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/api/auth", authRoute);
app.use("/api/dashboard", dashboardRoute)
app.use("/api/admin", adminRoute);
app.use("/api/farmer", farmerRoute);
app.use("/api/buyer", buyerRoute);
app.use("/api/transporter", transporterRoute);
app.use("/api/listings", listingRoute);
app.use("/api/prices", priceRoute);
app.use("/api/upload", uploadRoute);




const URI = process.env.MONGO_DB_URI;

mongoose
  .connect(URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log("Database connection error:");
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
