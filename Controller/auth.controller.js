const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../Models/user.model");

const registerUser = (req, res) => {
  console.log("REGISTER HIT 👉", req.body);
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    role,
    adminCode,
  } = req.body;

  // Validation
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !confirmPassword ||
    !role
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const upperRole = role.toUpperCase();

  // Protect admin registration
  if (upperRole === "ADMIN") {
    const adminCodeFromClient = req.body.adminCode;

    if (!adminCodeFromClient) {
      return res.status(400).json({ message: "Admin code is required" });
    }

    const validAdminCode = process.env.ADMIN_CODE;

    if (adminCodeFromClient !== validAdminCode) {
      return res
        .status(403)
        .json({ message: "Invalid admin registration code" });
    }
  }

  // Check if user already exists
  userModel
    .findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }

      // Hash password
      bcrypt.hash(password, 10).then((hashedPassword) => {
        const newUser = new userModel({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role: upperRole,
        });

        newUser
          .save()
          .then((user) => {
            res.status(201).json({
              status: true,
              message: "Account created successfully",
              user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
              },
            });
          })
          .catch((err) => {
            console.error("Save Error:", err);
            res.status(500).json({ message: "Failed to create user" });
          });
      });
    })
    .catch((err) => {
      console.error("Find Error:", err);
      res.status(500).json({ message: "Server error" });
    });
};


const loginUser = (req, res) => {
  console.log("LOGIN HIT 👉", req.body);
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find user
  userModel
    .findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Compare password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT
        const token = jwt.sign(
          {
            id: user._id,
            role: user.role,
            email: user.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

           console.log("Generated Token:", token);

        res.status(200).json({
          message: "Login successful",
          token,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          },
        });
      });
    })
    .catch((err) => {
      console.error("Login Error:", err);
      res.status(500).json({ message: "Server error" });
    });
};


module.exports = {
  registerUser,
  loginUser,
};
