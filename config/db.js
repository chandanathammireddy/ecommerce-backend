const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ecommerce_db"
});

db.connect(err => {
  if (err) {
    console.log("MySQL Connection Failed");
  } else {
    console.log("MySQL Connected");
  }
});

module.exports = db;
