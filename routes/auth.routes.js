const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

// create user with a hashed password
router.post("/signup", async (req, res, next) => {
  
  try {
    const { username, email, password, city, country } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create new user in the DB
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      city,
      country,
    });

    res.status(201).json({data: newUser, message: "user successfully created in DB" });
  } catch (error) {
    // console.error(error);
    // res.status(500).json({ message: "Error occured during signup" });
    next(error);
  }
});

//login route to find user by email and compare password

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    console.log ("JWT secret", process.env.JWT_SECRET);
    // Create JWT token
    const authToken = jwt.sign(
      { id: user._id, email: user.email }, //payload
      process.env.JWT_SECRET, // secret key
      {
        algorithm: "HS256",
        expiresIn: "1d",
      }
    );

    res.status(200).json({authToken, userId: user._id });
  } catch (error) {
    // console.error(error);
    // res.status(500).json({ message: "An error occurred during login." });
    next(error);
  }
});

//this route checks if the token is present and valid
router.get("/verify", isAuthenticated, async (req, res) => {
  console.log("here in the verify route");
  res.status(200).json({ message: "Token valid", payload: req.payload });
});

module.exports = router;
