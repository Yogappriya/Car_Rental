const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { car, validate } = require("../models/cars");
const { model } = require("../models/model");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  res.send(await car.find().sort({ name: 1 }));
});

router.get("/:name", async (req, res) => {
  const c = await car.find({ name: req.params.name });
  if (!c) {
    return res.status(400).send("Car with given name does not exist");
  }
  res.send(c);
});

router.get("/:id", async (req, res) => {
  const c = await car.find({ _id: req.params.id });
  if (!c) {
    return res.status(400).send("Car with given id does not exist");
  }
  res.send(c);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const m = await model.findById(req.body.modelId);
  if (!m) {
    return res.status(400).send("Invalid model");
  }

  const c = new car({
    name: req.body.name,
    carNumber: req.body.carNumber,
    numberAvailable: req.body.numberAvailable,
    dailyRentalRate: req.body.dailyRentalRate,
    model: {
      _id: m._id,
      name: m.name
    }
  });
  res.send(await c.save());
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const m = await model.find({ _id: req.body.modelId });
  if (!m) {
    return res.status(400).send("Invalid model");
  }

  const c = await car.findByIdAndUpdate(
    { _id: req.params.id },
    {
      name: req.body.name,
      carNumber: req.body.carNumber,
      numberAvailable: req.body.numberAvailable,
      dailyRentalRate: req.body.dailyRentalRate,
      model: {
        _id: m._id,
        name: m.name
      }
    }
  );

  if (!c) return res.status(400).send("Car with given id does not exist");
  res.send(c);
});

router.delete("/", async (req, res) => {
  const c = await car.deleteOne({ _id: req.body.id });
  if (!c) return res.send("invalid id");
  res.send(c);
});

module.exports = router;
