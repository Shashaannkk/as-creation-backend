// models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    serviceType: { type: String, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ["pending_payment", "pending_verification", "confirmed", "rejected"],
      default: "pending_payment",
    },
    tokenAmount: { type: Number, default: 100 },
    txnId: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
