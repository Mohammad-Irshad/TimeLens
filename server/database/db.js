const mongoose = require("mongoose");
require("dotenv").config();

const mongoDBURI = process.env.MONGODB_URI;

const initializeDatabase = async () => {
  try {
    const response = await mongoose.connect(mongoDBURI);
    if (response) return console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to the database");
  }
};

module.exports = { initializeDatabase };
