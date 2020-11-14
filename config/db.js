require("dotenv").config();

const mongoose = require("mongoose");

const url = process.env.MONGODB_CONNECTION_STRING;

const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    });
    console.log("connected");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
