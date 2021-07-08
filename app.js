/// Enable server
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

// App and middleware
const app = express();
app.use(express.json());

// Passport config
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
const db = require("./config/keys").mongoURI;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/users", require("./routes/api/users.js"));

// Run server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
