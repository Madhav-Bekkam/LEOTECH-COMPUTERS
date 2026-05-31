const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Replace with your local MongoDB URI or MongoDB Atlas connection string
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/leotech');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;