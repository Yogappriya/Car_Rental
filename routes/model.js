const express = require("express");
const router = express.Router();
const { model, validate } = require("../models/model");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
  res.send(await model.find());
});

router.get("/:id", async (req, res) => {
  const m = await model.findById(req.params.id);
  if (!m) return res.status(400).send("Model not found");
  res.send(m);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let m = new model({ name: req.body.name });
  res.send(await m.save());
});

router.put("/:name", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  res.send(
    await model.updateOne(
      { name: req.params.name },
      { $set: { name: req.body.name } }
    )
  );
});

router.delete("/:name", [auth, admin], async (req, res) => {
  res.send(await model.deleteOne({ name: req.params.name }));
});

module.exports = router;
