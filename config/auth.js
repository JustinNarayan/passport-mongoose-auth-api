module.exports = {
  ensureAuthenticated: (req, res, next) => {
    console.log(req);
    if (req.isAuthenticated()) return next();
    res.send({ messages: "You are not logged in", type: "failure" });
  },
};
