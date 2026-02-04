const express = require("express");
const router = express.Router();
const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API);

router.post("/", (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  console.log("📨 Preparing to send contact email...");

  resend.emails
    .send({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Contact Message from FarmFlow",
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })
    .then((data) => {
      console.log("Contact email sent via Resend:", data?.id || "No ID");
      res.json({ status: true, message: "Message sent successfully" });
    })
    .catch((err) => {
      console.error(" Email send error:", err);
      res.status(500).json({ message: "Failed to send message" });
    });
});

module.exports = router;
