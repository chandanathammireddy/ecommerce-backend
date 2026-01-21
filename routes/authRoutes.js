const express = require("express");
const router = express.Router();
const db = require("../config/db");

// LOGIN ROUTE
router.post("/login", (req, res) => {
    res.json({ message: "Login route working" });
});

// SIGNUP ROUTE - Fixed the handler function
router.post("/signup", (req, res) => {
    console.log("Data received:", req.body);
    res.json({ 
        message: "Signup route working",
        data: req.body 
    });
});

//forgot password route
router.post("/forgot-password", (req, res) => {
    const {email} = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

// temp response (DB+email comes later)
    res.json({ 
        message: "Password reset link sent to email (demo)",
        email: email
    });
});

//reset password route
router.post("/reset-password/:token", (req, res) => {
    console.log("Body:", req.body);
    console.log("Params:", req.params);

    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }
    // temp response (DB comes later)
    res.json({ 
        message: "Password reset successful (demo)",
        token: token,
        passwordReceived: password
    });
});


// Email Verification Route
router.get("/verify-email/:token", (req, res) => {
    const { token } = req.params;

    const sql = "UPDATE users SET is_verified = true, verification_token = NULL WHERE verification_token = ?";

    
    db.query(sql, [token], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Invalid or expired verification token" });
        }

        res.send("<h2>Email Verified Successfully!</h2><p>You can now log in.</p>");
    });
});
module.exports = router;
