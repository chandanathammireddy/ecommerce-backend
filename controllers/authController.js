const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const db = require("../config/db");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
//signup
exports.signup = (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const verification_token = crypto.randomBytes(32).toString("hex");

    const sql = "INSERT INTO users (name, email, password, role, verification_token, is_verified) VALUES (?, ?, ?, ?, ?, ?)";
    const values=[name, email, hashedPassword, role || "customer", verification_token, 0];

    db.query(sql, values, async (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ message: "User already exists or DB error", error: err });
      }

      console.log("User inserted with ID:", result.insertId);

      const verifyUrl = `http://localhost:3000/api/auth/verify-email/${verification_token}`;

      try {
        
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Verify your email",
          html: `<p>Please verify your email by clicking <a href="${verifyUrl}">here</a></p>`
        });
        return
        
        res.status(201).json({ message: "User registered successfully! Please verify your email." });
      } catch (emailErr) {
        console.error("Email error:", emailErr);
        return
     res.status(201).json({ message: "user registered but failed to send verification email." });
  }
});
    } catch (Error) {
        return
    res.status(500).json({ message: "Server error", error: Error.message });
  }
};

//email verification
exports.verifyEmail = (req, res) => {
  const { token } = req.params;

  const sql = "UPDATE users SET is_verified = true, verification_token = NULL WHERE verification_token = ?";

  db.query(sql, [token], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    res.send("<h2>Email Verified Successfully!</h2><p>You can now log in.</p>");
  });
};
//login
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  db.query("SELECT * FROM users WHERE email=?", [email], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) return res.status(404).json({ message: "User not found" });

    const user = result[0];

    if (!user.is_verified) {
      return res.status(403).json({ message: "Please verify your email first." });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1h" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });
};
//forget password
exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  db.query(
    "UPDATE users SET reset_token=?, reset_token_expiry=? WHERE email=?",
    [token, expiry, email],
    async (err, result) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const resetLink = `http://localhost:3000/api/auth/reset-password/${token}`; // Note: Updated URL structure if needed

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Password Reset",
          html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
        });
        res.json({ message: "Password reset link sent to email" });
      } catch (emailErr) {
        console.error("Email error:", emailErr);
        res.status(500).json({ message: "Failed to send email" });
      }
    }
  );
};

exports.resetPassword = (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) return res.status(400).json({ message: "Password is required" });

  // TODO: Check expiry time as well in query
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query(
    "UPDATE users SET password=?, reset_token=NULL, reset_token_expiry=NULL WHERE reset_token=?",
    [hashedPassword, token],
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB error" });
      if (result.affectedRows === 0) return res.status(400).json({ message: "Invalid or expired token" });

      res.json({ message: "Password reset successful" });
    }
  );
};