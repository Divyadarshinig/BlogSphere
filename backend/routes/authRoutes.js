const express = require("express");

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Protected test route
router.get("/protected", protect, (req, res) => {
    res.json({
        message: "You accessed a protected route!",
        userId: req.userId
    });
});

module.exports = router;