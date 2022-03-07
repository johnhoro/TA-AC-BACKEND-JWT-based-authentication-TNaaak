const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const user = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

user.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

user.methods.verifyPassword = async function (password) {
  var result = await bcrypt.compare(password, this.password);
  return result;
};

user.methods.signToken = async function () {
  var payload = { userId: this._id, email: this.email };
  try {
    const token = jwt.sign(payload, process.env.SECRET);
    console.log(token);
    return token;
  } catch (error) {
    return error;
  }
};

user.methods.userJson = function (token) {
  return {
    email: this.email,
    token: token,
  };
};

module.exports = mongoose.model("User", user);
