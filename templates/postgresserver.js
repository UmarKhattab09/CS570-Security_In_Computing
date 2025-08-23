const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection pool
const pool = new Pool({
  user: "admin",        // your PG username
  host: "localhost",       // or server address
  database: "securityComputing",       // your DB name
  password: "admin", // your PG password
  port: 5432,              // default Postgres port
});

// Test DB connection
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch(err => console.error("❌ Connection error", err.stack));

// Register route
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if email exists
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // insert new user
    await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, password]);

    return res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if email exists
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // success
    return res.status(200).json({ message: "Login successful", userId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});


// Start server
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
