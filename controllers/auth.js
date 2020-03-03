const jwt = require("jsonwebtoken");
require("dotenv").config();
const expressJwt = require("express-jwt");
const User = require("../models/user");

exports.signup = async (req, res) => {
  const userExist = await User.findOne({ email: req.body.email });
  if (userExist) {
    return res.status(403).json({
      error: "Email is taken"
    });
  }

  const user = await new User(req.body);
  await user.save();
  res.json({ message: "Signup successful! Please, Login" });
};

exports.signin = (req, res) => {
  // found the user by email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    // if err or no user
    if (err || !user) {
      return res
        .status(404)
        .json({ error: "Email does not exist. Please sign." });
    }

    // if user is found make sure the email and password match
    if (!user.authenticate(password)) {
      return res.status(401).json({ error: "Password does not match." });
    }
    // generate token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // persist token as 't' in cookies
    res.cookie("t", token, { expire: new Date() + 9999 });
    // return response with user and token to frontend client
    const { _id, email, name } = user;
    return res.json({ token, user: { _id, email, name } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  res.json({ message: "Sign out successful!" });
};

exports.requireSignin = expressJwt({
  // if the token is valid, express jwt will appends the verified user
  // in an auth key of the request object
  secret: process.env.JWT_SECRET,
  userProperty: "auth"
});
