const _ = require("lodash");
const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// signup a user
router.post("/", async (req, res) => {
  try {
    // check if user exists
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("Email already registered");

    user = new User(req.body);
    await user.save();

    // generate webtoken
    const token = await user.generateAuthToken();

    // res.status(201).send(_.pick(user, ["name", "age", "email", "tokens"]));
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send("Could not create New user");
  }
});

// login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);

    // generate webtoken
    const token = user.generateAuthToken();

    res.status(200).send({ user, token });
  } catch (err) {
    res.status(400).send("Email or Password is invalid");
  }
});

// logout user
router.post("/logout", auth, async (req, res) => {
  try {
    // select the specific token used to login
    req.user.tokens = req.user.tokens.filter(t => t.token !== req.token);
    await req.user.save();
    res.status(200).send("User successfully logged out!");
  } catch (err) {
    res.status(500).send("Could not complete process");
  }
});

// delete all login tokens
router.post("/logoutAll", auth, async (req, res) => {
  try {
    // empty the tokens array
    req.user.tokens = [];
    await req.user.save();
    res.send("Logged out from all accounts");
  } catch (err) {
    res.status(500).send("Could not complete process");
  }
});

// edit a user
router.put("/:id", auth, async (req, res) => {
  const fields = Object.keys(req.body);
  const allowedFields = ["name", "age", "email", "password"];
  const isValidOperation = fields.every(field => allowedFields.includes(field));

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid Updates" });

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).send("User not Found");

    fields.forEach(field => (user[field] = req.body[field]));
    await user.save();

    // const { name, age, email, password } = req.body;
    // const user = await User.findByIdAndUpdate(
    //   { _id: req.params.id },
    //   { $set: { name, age, email, password } },
    //   { new: true, runValidators: true }
    // );

    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error, "Could not update User");
  }
});

// delete current profile
router.delete("/me", auth, async (req, res) => {
  try {
    req.user.remove();
    res.status(200).end(req.user);
  } catch (err) {
    res.status(400).send("User was not Deleted");
  }
});

// current user profile
router.get("/me", auth, async (req, res) => {
  res.status(200).send(req.user);
});

router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    res.send(user);
  } catch (err) {
    res.status(400).send("User with given ID not found");
  }
});

module.exports = router;
