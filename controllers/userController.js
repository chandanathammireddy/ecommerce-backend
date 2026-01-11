const db = require("../config/db");

exports.getProfile = (req, res) => {
  res.json({ message: "User profile endpoint" });
};

exports.updateProfile = (req, res) => {
  res.json({ message: "Profile updated" });
};
