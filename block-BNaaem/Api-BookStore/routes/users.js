var express = require("express");
const Version1User = require("../models/User");
var router = express.Router();
var auth = require("../middlewares/auth");

//registration handler
router.post(`/register`, async (req, res, next) => {
  try {
    var user = await Version1User.create(req.body);
    console.log(user);
    var token = await user.signToken();
    res.status(201).json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

//login handler
router.post(`/login`, async (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email/Password required" });
  }
  try {
    var user = await Version1User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Email not registered" });
    }
    var result = await user.verifyPassword(password);
    console.log(user, result);
    if (!result) {
      return res.status(400).json({ error: "Invalid password" });
    }
    //generate token
    var token = await user.signToken();
    console.log(token);
    res.json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

// Protected route
router.use(auth.verifyToken);

router.get("/dashboard", async (req, res, next) => {
  try {
    console.log(req.user);
    var user = await Version1User.findById(req.user.userId);
    console.log(`hi`);
    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        userId: user.id,
      },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
