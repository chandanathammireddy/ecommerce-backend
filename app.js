const express = require("express");
const cors = require("cors");

require("./config/db");

const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");


const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

app.get("/test", (req, res) => {
    res.send("API is working");
});
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
