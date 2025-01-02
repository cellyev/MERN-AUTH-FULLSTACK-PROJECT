const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connection to MongoDB: ", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
