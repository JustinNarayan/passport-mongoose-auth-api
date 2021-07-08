const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

// Load User model
const User = require("../models/User");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      // Match user
      const thisUser = await User.findOne({ username });
      if (!thisUser)
        return done(null, false, {
          message: "That username is not registered",
          type: "failure",
        });

      // Match password
      await bcrypt.compare(
        password,
        thisUser.password,
        (err, correctPassword) => {
          if (err) throw err;
          if (correctPassword)
            return done(null, thisUser, {
              message: "Successful login",
              type: "success",
            });
          else
            return done(null, false, {
              message: "Password incorrect",
              type: "failure",
            });
        }
      );
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((_id, done) => {
    User.findById(_id, (err, user) => done(err, user));
  });
};
