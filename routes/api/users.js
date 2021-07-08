const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
let keys;
try {
  keys = require("../../config/keys");
} catch (err) {
  // module doesn't exist in production, use environmental variables
}

// Load User model
const User = require("../../models/User");

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
    res
      .status(201)
      .send({ message: "User successfully registered", type: "success" });
  } catch (err) {
    // Send error message to front end
    res.send({ message: errMessage, type: "failure", err });
  }
});

module.exports = router;
