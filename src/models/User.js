const bcrypt = require("bcrypt");
const validator = require("validator");
const mongoose = require("../db/mongoose");

// user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    default: 0,
    validate(v) {
      if (v < 0) {
        throw new Error("Age must be a positive integer");
      }
    }
  },
  email: {
    type: String,
    required: true,
    validate(v) {
      if (!validator.isEmail(v)) {
        throw new Error("Email is invalid");
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    validate(v) {
      if (v.toLowerCase().includes("password")) {
        throw new Error("Please try using another password");
      }
    }
  }
});

// hash password middleware
userSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// user model
const User = mongoose.model("User", userSchema);

module.exports = User;
