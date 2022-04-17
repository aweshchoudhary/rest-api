const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmationCode: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
