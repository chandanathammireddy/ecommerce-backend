const express = require("express");
const cors = require("cors");

require("./config/db");

const authRoutes = require("./routes/authroutes");
const userRoutes = require("./routes/userroutes");
const adminRoutes = require("./routes/adminroutes");
const productRoutes = require("./routes/productroutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
