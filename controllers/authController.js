const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const db = require("../config/db"); // Ensure path is correct
const nodemailer = require("nodemailer");
exports.signup = (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return  res.status(400).json({ message: "All fields are required",});
    }
    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const verification_token = crypto.randomBytes(32).toString("hex");

        const sql = "INSERT INTO users (name, email, password, role, verification_token, is_verified) VALUES (?, ?, ?, ?, ?, ?)";
    
    db.query(sql, [name, email, hashedpassword, role || "user", verification_token, false], async (err) => {
        if (err) {

            return res.status(500).json({ message: "user already exists or DB error",});
        }
        
        const verifyUrl = `http://localhost:3000/api/auth/verify-email/${verification_token}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "yourgmail@gmail.com",
                pass: "your-app-password"
            }
        });

        await transporter.sendMail({
            from: "yourgmail@gmail.com",
            to: email,
            subject: "Verify your email",
            html: `<p>Please verify your email by clicking <a href="${verifyUrl}">here</a></p>`
        });

        console.log("Verification token:", verification_token);
        res.ststus(201).json({ message: "User registered successfully! Please verify your email.",});
    });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message,});
    }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    (err, result) => {

    if (err) return res.status(500).json(err);

      if (result.length === 0)
        return res.status(404).json({ message: "User not found" });

      const user = result[0];
      const isMatch = bcrypt.compareSync(password, user.password);

      if (!isMatch)
        return res.status(401).json({ message: "Wrong password" });

      const token = jwt.sign({ id: user.id, role: user.role }, "secretkey");
      res.json({ token });
    }
  );
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "harichandanathammireddy3333@gmail.com",
    pass: "Chandana@913"
  }
});

const crypto = require("crypto");

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
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const resetLink = `http://localhost:3000/reset-password/${token}`;

      // (Email sending can be added later)
      console.log("Reset Link:", resetLink);

      res.json({ message: "Password reset link sent" });
    }
  );
};

   