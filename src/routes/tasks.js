const express = require("express");
const Task = require("../models/Task");

const route = express.Router();

route.get("/", async (req, res) => {
  const tasks = await Task.find().select("-name");
  res.status(200).send(tasks);
});

route.get("/:id", async (req, res) => {
  const task = await Task.findById({ _id: req.params.id });
  if (!task)
    return res.status(404).send({ error: "Cannot find Task with given ID" });
  res.status(200).send(task);
});

route.post("/", async (req, res) => {
  try {
    const { description, isComplete } = req.body;
    let task = new Task({ description, isComplete });
    task = await task.save();
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send({ error: "Could not Create Task" });
  }
});

route.put("/:id", async (req, res) => {
  const fields = Object.keys(req.body);
  const allowedFields = ["description", "isComplete"];
  const isValidOperation = fields.every(field => allowedFields.includes(field));
  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid Update field(s)" });

  try {
    const { description, isComplete } = req.body;
    const task = await Task.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { description, isComplete } },
      { new: true, runValidators: true }
    );
    if (!task)
      return res.status(404).send({ error: "Cannot find Task with given ID" });
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send({ error: "Could not Update the given ID" });
  }
});

route.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndRemove({ _id: req.params.id });
    if (!task)
      return res.status(404).send({ error: "Cannot find Task with given ID" });
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send({ error: "Could not Delete the given ID" });
  }
});

module.exports = route;
