const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { customer, validate } = require("../models/customer");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  res.send(await customer.find().sort({ name: 1 }));
});

router.get("/:id", async (req, res) => {
  const c = await customer.findById(req.params.id);
  if (!c) {
    return res.status(400).send("Customer with the given id not found");
  }
  res.send(c);
});

router.post("/", auth, async (req, res) => {
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
