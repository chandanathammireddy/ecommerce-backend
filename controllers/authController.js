const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
  const { name, email, password, role } = req.body;
  const hashed = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
    [name, email, hashed, role || "customer"],
    (err) => {
      if (err) return res.status(400).json(err);
      res.json({ message: "User registered successfully" });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    (err, result) => {
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
