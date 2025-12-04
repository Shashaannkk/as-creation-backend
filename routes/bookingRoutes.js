// routes/bookingRoutes.js
const express = require("express");
const Booking = require("../models/Booking");

const router = express.Router();

// Create a new booking
router.post("/", async (req, res) => {
  try {
    const { name, phone, date, serviceType, notes } = req.body;

    if (!name || !phone || !date || !serviceType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const booking = await Booking.create({
      name,
      phone,
      date,
      serviceType,
      notes: notes || "",
      status: "pending_payment",
      tokenAmount: 100
    });

    res.json({
      success: true,
      bookingId: booking._id,
      message: "Booking created. Please complete UPI payment and enter transaction ID."
    });
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// User submits transaction ID
router.post("/:id/txn", async (req, res) => {
  try {
    const { id } = req.params;
    const { txnId } = req.body;

    if (!txnId) {
      return res.status(400).json({ error: "Transaction ID is required" });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.txnId = txnId;
    booking.status = "pending_verification";
    await booking.save();

    res.json({
      success: true,
      message: "Transaction ID submitted. Your booking is pending verification."
    });
  } catch (err) {
    console.error("Submit txn error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
