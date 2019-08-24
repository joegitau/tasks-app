const express = require("express");
const User = require("../models/User");

const route = express.Router();

route.get("/", async (req, res) => {
  try {
    const users = await User.find().sort("-name");
    res.send(users);
  } catch (error) {
    res.status(400).send(error);
  }
});

route.get("/:id", async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

route.post("/", async (req, res) => {
  try {
    const { name, age, email, password } = req.body;
    let users = new User({ name, age, email, password });
    users = await users.save();
    res.send(users);
  } catch (error) {
    res.status(400).send(error);
  }
});

route.put("/:id", async (req, res) => {
  const fields = Object.keys(req.body);
  const allowedFields = ["name", "age", "email", "password"];
  const isValidOperation = fields.every(field => allowedFields.includes(field));

  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid Updates" });

  try {
    const { name, age, email, password } = req.body;
    const user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { name, age, email, password } },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).send();
    res.send(user);
  } catch (error) {
    res.status(400).send(error, "Could not update User");
  }
});

route.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndRemove({ _id: req.params.id });
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = route;
