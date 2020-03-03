const mongoose = require("mongoose");
const uuidv1 = require("uuid/v1");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  hashed_password: {
    type: String,
    required: true
  },
  salt: String,
  created: {
    type: Date,
    default: Date.now
  },
  updated: Date
});

userSchema
  .virtual("password")
  .set(function(password) {
    //   create a temporary password
    this._password = password;
    // salt
    this.salt = uuidv1();
    // set the temp/encrypted password to hashed_password
    this.hashed_password = this.encryptedPassword(password);
  })
  .get(function() {
    return this._password;
  });

userSchema.methods = {
  authenticate: function(password) {
    return this.encryptedPassword(password) === this.hashed_password;
  },
  encryptedPassword: function(password) {
    if (!password) return "";

    try {
      // encrypt password
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  }
};

module.exports = mongoose.model("User", userSchema);
