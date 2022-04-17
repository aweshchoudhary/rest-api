const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("Database is Connected");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = mongoose;
