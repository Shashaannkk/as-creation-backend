// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // 👇 DEBUG LOG: Check if the link is loaded
    console.log("---------------------------------------------------");
    console.log("🔍 ATTEMPTING TO CONNECT TO:");
    console.log(process.env.MONGO_URI || "⚠️ UNDEFINED - Check your .env file!");
    console.log("---------------------------------------------------");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;