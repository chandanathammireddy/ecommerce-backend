const db = require("../config/db");

exports.getAll = (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    res.json(result);
  });
};

exports.getOne = (req, res) => {
  db.query(
    "SELECT * FROM products WHERE id=?",
    [req.params.id],
    (err, result) => res.json(result)
  );
};

exports.byCategory = (req, res) => {
  db.query(
    "SELECT * FROM products WHERE category=?",
    [req.params.category],
    (err, result) => res.json(result)
  );
};

exports.featured = (req, res) => {
  db.query(
    "SELECT * FROM products WHERE featured=true",
    (err, result) => res.json(result)
  );
};

exports.newArrivals = (req, res) => {
  db.query(
    "SELECT * FROM products ORDER BY created_at DESC LIMIT 5",
    (err, result) => res.json(result)
  );
};
