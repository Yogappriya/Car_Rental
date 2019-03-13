const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { rental, validate } = require("../models/rental");
const { customer } = require("../models/customer");
const { car } = require("../models/cars");
const Fawn = require("fawn");

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  res.send(await rental.find());
});

router.get("/:id", async (req, res) => {
  const r = await rental.findById(req.params.id);
  if (!r) return res.status(400).send("Invalid rental id");

  res.send(r);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const Car = await car.findById(req.body.carId);
  const c = await customer.findById(req.body.customerId);

  if (!Car) return res.status(400).send("invalid car id");
  if (!c) return res.status(400).send("invalid customer id");

  if (Car.numberAvailable === 0)
    return res.status(400).send("car not available ");

  const r = new rental({
    customer: {
      isGold: c.isGold,
      name: c.name,
      phone: c.phone,
      _id: c._id
    },
    car: {
      _id: Car._id,
      name: Car.name,
      dailyRentalRate: Car.dailyRentalRate
    },
    rentFee: Car.dailyRentalRate
  });
  try {
    new Fawn.Task()
      .save("rentals", r)
      .update(
        "cars",
        { _id: Car._id },
        {
          $inc: { numberAvailable: -1 }
        }
      )
      .run();
    res.send(r);
  } catch (e) {
    res.status(500).send("something failed");
  }
});

module.exports = router;
