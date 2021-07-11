/// This route setup is for a very basic demo site NOT implementing a framework or template engine
const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

// Welcome
router.get("/", (req, res) => {
  res.send({ text: "This is the welcome page" });
});

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.send({ text: "This is the dashboard page" });
});

module.exports = router;
