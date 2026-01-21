const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Admin route - requires authentication and admin role
router.get("/", authenticateToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Admin route working", user: req.user });
});

// Protected admin route
router.get(
  "/dashboard",
  authenticateToken,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Admin dashboard accessed", user: req.user });
  }
);

module.exports = router;
