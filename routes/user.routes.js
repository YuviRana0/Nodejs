const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const UserModel = require("../models/userModel");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


router.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});

router.post(
  "/register",
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("email")
    .trim()
    .isEmail()
    .isLength({ min: 8 })
    .withMessage("Please enter a valid email address"),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Invalid Data" });
    }

    const { username, email, password } = req.body;
    const hashedPassword = await bycrypt.hash(password, 10);
    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });
    res.json(newUser);
  }
);

router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});
router.post(
  "/login",
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),

  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Invalid Data" });
    }

    const { username, password } = req.body;
    const user = await UserModel.findOne({ username: username });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Username/Password is incorrect" });
    }

    const isMatch = await bycrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Username/Password is incorrect" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token);
    res.send("Login successful");
  }
);
module.exports = router;
