const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { customer, validate } = require("../models/customer");

router.get("/", async (req, res) => {
  res.send(await customer.find().sort({ name: 1 }));
});

router.get("/:phone", async (req, res) => {
  const c = await customer.find({ phone: req.params.phone });
  if (!c)
    return res
      .status(400)
      .send("Customer with the given phone number not found");
  res.send(c);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let c = new customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });
  res.send(await c.save());
});

router.put("/:phone", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  res.send(
    await customer.updateOne(
      { phone: req.params.phone },
      {
        $set: {
          name: req.body.name,
          phone: req.body.phone,
          isGold: req.body.isGold
        }
      }
    )
  );
});

router.delete("/:phone", async (req, res) => {
  res.send(await customer.deleteOne({ phone: req.params.phone }));
});

module.exports = router;
