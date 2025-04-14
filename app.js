// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

const cors = require("cors");

// Allow requests from the origin specified in the .env file
const corsOptions = {
  origin: process.env.ORIGIN, 
  credentials: true, // Allow cookies and credentials
};

app.use(cors(corsOptions));

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);
const userRoutes = require("./routes/user.routes");
app.use("/user", userRoutes);
const listingRoutes = require("./routes/listing.routes");
app.use("/listing", listingRoutes);
const requestRoutes = require("./routes/request.routes");
app.use("/request", requestRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
