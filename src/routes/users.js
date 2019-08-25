const _ = require("lodash");
const jwt = require("jsonwebtoken");
const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const route = express.Router();

// signup a user
route.post("/", async (req, res) => {
  try {
    const { name, age, email, password } = req.body;
    let user = new User({ name, age, email, password });
    await user.save();

    // generate webtoken
    const token = await user.generateAuthToken();

    res.status(201).send(_.pick(user, ["name", "age", "email", "tokens"]));
  } catch (error) {
    res.status(400).send(error);
  }
});

route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);

    // generate webtoken
    const token = user.generateAuthToken();

    res
      .header("x-auth-token", token)
      .status(200)
      .send(user);
  } catch (err) {
    res.status(400).send();
  }
});

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

route.delete("/:id", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndRemove({ _id: req.params.id });
    res.send(user);
  } catch (err) {
    res.status(400).send("User was not Deleted");
  }
});

// user profile
route.get("/me", auth, async (req, res) => {
  try {
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send("User not Found");
  }
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
