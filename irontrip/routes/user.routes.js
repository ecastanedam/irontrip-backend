const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const { isAuthenticated } = require("../middlewares/jwt.middleware"); // create and import the middleware to check if it's authenticated

// GET /user/:userId
router.get("/user/:userId", isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUser = await User.findById(userId);
    const userCopy = currentUser;
    userCopy.password = null;

    res.status(200).json(userCopy);
  } catch (error) {
    next(error);
  }
});

// PATCH /user/update/:userId
router.patch("/update/:userId", isAuthenticated, async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// DELETE /user/delete/:userId

router.delete("/delete/:userId", isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ message: "User successfully deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
