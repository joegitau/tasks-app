const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().populate("user");
    res.status(200).send(tasks);
  } catch (err) {
    res.status(400).send("Could not fetch Tasks", err);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      creator: req.user._id
    });
    if (!task) return res.status(404).send({ error: "Cannot find Task" });
    res.status(200).send(task);
  } catch (err) {
    res.status(500).send("Something went wrong!");
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const task = new Task({ ...req.body, creator: req.user._id });
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send("Could not Create Task");
  }
});

router.put("/:id", auth, async (req, res) => {
  const fields = Object.keys(req.body); // map the req.body object into an array of strings
  const allowedFields = ["description", "isComplete"];
  const isValidOperation = fields.every(field => allowedFields.includes(field));
  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid Update field(s)" });

  try {
    const task = await Task.findById(req.params.id);
    if (!task)
      return res.status(400).send({ error: "Cannot find Task with given ID" });

    fields.forEach(field => (task[field] = req.body[field]));
    await task.save();

    // const { description, isComplete } = req.body;
    // const task = await Task.findByIdAndUpdate(
    //   { _id: req.params.id },
    //   { $set: { description, isComplete } },
    //   { new: true, runValidators: true }
    // );

    res.status(200).send(task);
  } catch (error) {
    res.status(400).send({ error: "Could not Update the given ID" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndRemove({ _id: req.params.id });
    if (!task)
      return res.status(404).send({ error: "Cannot find Task with given ID" });
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send({ error: "Could not Delete the given ID" });
  }
});

module.exports = router;
