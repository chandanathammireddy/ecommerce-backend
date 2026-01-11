const express = require("express");
const router = express.Router();

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


module.exports = router;