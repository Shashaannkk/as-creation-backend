const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Razorpay = require("razorpay"); // Import Razorpay
const crypto = require("crypto");     // Import Crypto

dotenv.config();

const app = express();

// 1. Connect DB
connectDB();

// 2. CORS Middleware (Cleaned up - only defined once)
// This allows connections from Localhost (testing) and GitHub (live)
app.use(cors({
    origin: [
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "https://shashaannkk.github.io"
    ],
    credentials: true
}));

// 3. Body parser
app.use(express.json());

// ---------------------------------------------
// 👇 RAZORPAY SETUP (Missing in your file)
// ---------------------------------------------

// Initialize Razorpay with your TEST keys
const razorpay = new Razorpay({
    key_id: 'rzp_test_RnQldIaI6gOLET',    // 🔴 REPLACE WITH YOUR KEY ID
    key_secret: 'lOkpTGDV2W715eLe1ny1LKq6' // 🔴 REPLACE WITH YOUR KEY SECRET
});

// Route: Create Order
app.post("/api/create-order", async (req, res) => {
    try {
        const options = {
            amount: 100 * 100, // ₹100.00
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("Razorpay Error:", error);
        res.status(500).send(error);
    }
});

// Route: Verify Payment
app.post("/api/verify-payment", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", 'lOkpTGDV2W715eLe1ny1LKq6') // 🔴 REPLACE WITH SECRET AGAIN
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        // Payment Success!
        console.log("Payment Verified for Booking:", bookingId);
        // Optional: Update your DB here using bookingId
        res.json({ success: true, message: "Payment Verified" });
    } else {
        res.status(400).json({ success: false, error: "Invalid Signature" });
    }
});
// ---------------------------------------------
// 👆 END RAZORPAY SETUP
// ---------------------------------------------

// Existing Routes
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("AS Creation backend is running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});