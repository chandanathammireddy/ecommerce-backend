const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");

// Protected user route - requires authentication
router.get("/", authenticateToken, (req, res) => {
  res.json({ message: "User route working", user: req.user });
});

// Profile route - requires authentication
router.get("/profile", authenticateToken, (req, res) => {
  res.json({
    message: "User profile accessed",
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

module.exports = router;
