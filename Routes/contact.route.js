const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config(); 

router.post("/", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: `"FarmFlow Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "New Contact Message",
    html: `
      <h3>New Contact Message</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  transporter
    .sendMail(mailOptions)
    .then((info) => {
      console.log("Email sent:", info.response);
      res.json({ status: true, message: "Message sent successfully" });
    })
    .catch((err) => {
      console.error("Email error:", err);
      res.status(500).json({ message: "Failed to send message" });
    });
});

module.exports = router;
