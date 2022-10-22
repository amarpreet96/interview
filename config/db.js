const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI"); 

/**
 * function to connect to database
 */
const connectDB = async () => {
  try {
    await mongoose.connect(db, { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("database connection successful");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
