// routes/adminRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Booking = require("../models/Booking");
const auth = require("../middleware/auth");

const router = express.Router();

// Admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get bookings
router.get("/bookings", auth, async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status) query.status = status;

    const bookings = await Booking.find(query).sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (err) {
    console.error("Get bookings error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update booking status
router.patch("/bookings/:id/status", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending_payment", "pending_verification", "confirmed", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ success: true, booking });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
