const mongoose = require("mongoose");
require("dotenv").config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
  } catch (e) {
    console.log(e);
    process.exit();
  }
};

module.exports = connect;
