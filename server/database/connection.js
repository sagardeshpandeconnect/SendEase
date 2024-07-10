const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
    });
    console.log("Connected to Database Successfully");
  } catch (error) {
    console.error(`${error} did not connect`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
