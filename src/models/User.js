const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
    unique: true,
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
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

// custom mongoose statics middlware
userSchema.statics.findByCredentials = async function(email, password) {
  // verify email
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("Email or Password is invalid");

  // verify password
  const isPassword = await bcrypt.compare(password, user.password);
  if (!isPassword) return res.status(400).send("Email or Password is invalid");

  return user;
};

// hash password middleware
userSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// generate web token
userSchema.methods.generateAuthToken = async function() {
  const token = await jwt.sign({ _id: this._id }, "jwtPrivateKey", {
    expiresIn: "30 days"
  });

  // create new array that will include an already created token object + the new tokn object
  this.tokens = this.tokens.concat({ token });
  this.save();

  return token;
};

// user model
const User = mongoose.model("User", userSchema);

module.exports = User;
