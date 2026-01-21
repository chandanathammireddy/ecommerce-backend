const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");

// Public route - anyone can access
router.get("/", (req, res) => {
  res.json({ message: "Product route working" });
});

// Protected route - requires authentication
router.get("/protected", authenticateToken, (req, res) => {
  res.json({
    message: "Protected product route accessed successfully",
    user: req.user,
  });
});

module.exports = router;
