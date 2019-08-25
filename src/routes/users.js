const _ = require("lodash");
const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const route = express.Router();

// signup a user
route.post("/", async (req, res) => {
  const { name, age, email, password } = req.body;
  const user = new User({ name, age, email, password });
  try {
    await user.save();

    // generate webtoken
    const token = await user.generateAuthToken();

    // res.status(201).send(_.pick(user, ["name", "age", "email", "tokens"]));
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

// login user
route.post("/login", async (req, res) => {
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

// edit a user
route.put("/:id", auth, async (req, res) => {
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

// delete user
route.delete("/:id", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndRemove({ _id: req.params.id });
    res.send(user);
  } catch (err) {
    res.status(400).send("User was not Deleted");
  }
});

// current user profile
route.get("/me", auth, async (req, res) => {
  res.status(200).send(req.user);
});

route.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    res.send(user);
  } catch (err) {
    res.status(400).send("User with given ID not found");
  }
});

module.exports = route;
