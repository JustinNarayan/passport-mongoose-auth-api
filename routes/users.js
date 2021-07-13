const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
let keys;
try {
  keys = require("../config/keys");
} catch (err) {
  // module doesn't exist in production, use environmental variables
}

// Load User model
const User = require("../models/User");

// Login
router.get("/login", (req, res) => {
  res.send({ text: "This is the login page" });
});

// Register
router.get("/register", (req, res) => {
  res.send({ text: "This is the register page" });
});

// Current User
router.get("/current", (req, res) => {
  res.send(req.user);
});

/**
 * Register a new user
 * @POST /register
 * @body username (string)
 * @body password (string)
 */

router.post("/register", async (req, res) => {
  // Deconstruct request
  const { username, password } = req.body;

  // Track errors
  let errMessage;

  try {
    // Hash password
    errMessage = "Failed to hash password";
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT, 10) || keys.salt
    );

    // Check if username is taken
    errMessage = "Failed to contact database";
    const existingUser = await User.findOne({ username: username });
    errMessage = "That username is taken";
    if (existingUser != null) throw "";

    // Insert newly created user
    errMessage = "Failed to register user in database";
    await new User({ username, password: hashedPassword }).save();

    // Success
    res.status(201).send({
      message: "User successfully registered - SHOULD REDIRECT TO LOGIN",
      type: "success",
    });
  } catch (err) {
    // Send error message to front end
    res.send({ message: errMessage, type: "failure", err });
  }
});

/**
 * Logs in a user
 * @POST /login
 * @body username (string)
 * @body password (string)
 */

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    try {
      if (err) throw err;
      if (!user)
        res.send({ message: "Invalid login credentials", type: "failure" });
      else {
        req.logIn(user, (err) => {
          if (err) throw err;
          return res.send({
            message: "Successfully logged in - SHOULD REDIRECT TO DASHBOARD",
            type: "success",
          });
        });
      }
    } catch (err) {
      res.send({ message: "Failed to log in", type: "failure", err });
    }
  })(req, res, next);
});

/**
 * Logs out a user
 * @GET /logout
 */

router.get("/logout", (req, res) => {
  req.logout();
  res.send({
    messages: "Successfully logged out - SHOULD REDIRECT TO LOGIN",
    type: "success",
  });
});

module.exports = router;
