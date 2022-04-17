const express = require("express");
const router = express.Router();
const User = require("../database/models/User");
const emailCheck = require("email-check");
const jwt = require("jsonwebtoken");
const { createPassword, comparePassword } = require("../apps/password");

router.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  const token = jwt.sign({ email }, process.env.SECRET);
  const hashPassword = await createPassword(password);
  const findUser = await User.findOne({ email });
  if (!findUser) {
    let check;
    await emailCheck(email)
      .then(() => (check = true))
      .catch((err) => (check = false));

    if (check) {
      const newUser = new User({
        fullName,
        email,
        password: hashPassword,
        confirmationCode: token,
      });
      await newUser
        .save()
        .then(() => {
          res.status(200).json({
            message: "User registered succesfully",
            user: { ...newUser },
          });
        })
        .catch((err) => {
          res.status(400).json({ message: "Something went wrong" });
        });
    } else {
      res.status(400).json({ message: "Email not exists" });
    }
  } else {
    res.status(400).json({ message: "User already exists" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const comparePass = await comparePassword(password, user.password);
    if (comparePass) {
      res.status(200).json({ message: "Login succesful", user: { ...user } });
    } else {
      res.status(400).json({ message: "Password is incorrect" });
    }
  } else {
    res.status(400).json({ message: "We could'nt find your email" });
  }
});

router.post("/verify", async (req, res) => {
  const { email } = req.body;
  const loggedUser = await User.findOne({ email });

  if (loggedUser) {
    if (!loggedUser.emailVerified) {
      require("../apps/mail")(email, loggedUser);
      res.status(200).json({ message: `Verification email sent to ${email}` });
    } else {
      res.status(400).json({ message: "Email already verified" });
    }
  } else {
    res.status(400).json({ message: "Email not exists" });
  }
});

router.get("/verify/:id", async (req, res) => {
  const confirmId = req.params.id;
  const user = await User.findOne({ confirmationCode: confirmId });
  if (user) {
    user.emailVerified = true;
    await user.save();
    res.status(200).json({ message: "Email Verified" });
  } else {
    res.status(400).json({ message: "Email not verified" });
  }
});

router.post("/delete", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const comparedPassword = await comparePassword(password, user.password);
    if (comparedPassword) {
      await User.findOneAndDelete({ email });
      res
        .status(200)
        .json({ message: `User ${email} account has been deleted.` });
    } else {
      res.status(400).json({ message: "Password is incorrect" });
    }
  } else {
    res.status(400).json({ message: "Email is incorrect" });
  }
});

router.post("/update", async (req, res) => {
  const { email, update } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    if (update.password) {
      const hashPassword = await createPassword(update.password);
      update.password = hashPassword;
    }
    await user.update({ $set: update });
    res.status(200).json({ message: "User updated." });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

module.exports = router;
