const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();
app.use(cors());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "foodapp",
});

const JWT_SECRET = "your_jwt_secret_key"; // Change this in production

// Middleware to verify token
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// ** User & Vendor Authentication **

// Register User
app.post("/register/user", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      hashedPassword,
    ]);
    res.json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register Vendor
app.post("/register/vendor", async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.query("INSERT INTO vendors (username, password) VALUES (?, ?)", [
      username,
      hashedPassword,
    ]);
    res.json({ message: "Vendor registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Login
app.post("/login/user", async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);

  if (rows.length === 0)
    return res.status(400).json({ message: "User not found" });

  const validPassword = await bcrypt.compare(password, rows[0].password);
  if (!validPassword)
    return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: rows[0].id, username: rows[0].username, role: "user" },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({ token });
});

// Vendor Login
app.post("/login/vendor", async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await db.query("SELECT * FROM vendors WHERE username = ?", [
    username,
  ]);

  if (rows.length === 0)
    return res.status(400).json({ message: "Vendor not found" });

  const validPassword = await bcrypt.compare(password, rows[0].password);
  if (!validPassword)
    return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: rows[0].id, username: rows[0].username, role: "vendor" },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({ token });
});

// ** Food API **

// Get all food items (Public)
app.get("/food", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM food_items");
  res.json(rows);
});

// Add food (Only Vendor)
app.post("/food", authenticate, async (req, res) => {
  if (req.user.role !== "vendor")
    return res.status(403).json({ message: "Access Denied" });

  const { name, price, description } = req.body;
  await db.query(
    "INSERT INTO food_items (name, price, description) VALUES (?, ?, ?)",
    [name, price, description]
  );
  res.json({ message: "Food added!" });
});

// Delete food (Only Vendor)
app.delete("/food/:id", authenticate, async (req, res) => {
  if (req.user.role !== "vendor")
    return res.status(403).json({ message: "Access Denied" });

  const { id } = req.params;
  await db.query("DELETE FROM food_items WHERE id = ?", [id]);
  res.json({ message: "Food deleted!" });
});

// ** Order API (User Only) **

// Place an order (User Only)
app.post("/order", authenticate, async (req, res) => {
  if (req.user.role !== "user")
    return res.status(403).json({ message: "Access Denied" });

  const { food_id, quantity } = req.body;
  await db.query(
    "INSERT INTO orders (user_id, food_id, quantity) VALUES (?, ?, ?)",
    [req.user.id, food_id, quantity]
  );
  res.json({ message: "Order placed successfully!" });
});

// Get orders for a user
app.get("/orders", authenticate, async (req, res) => {
  if (req.user.role !== "user")
    return res.status(403).json({ message: "Access Denied" });

  const [orders] = await db.query(
    "SELECT o.id, f.name, o.quantity FROM orders o JOIN food_items f ON o.food_id = f.id WHERE o.user_id = ?",
    [req.user.id]
  );
  res.json(orders);
});

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
