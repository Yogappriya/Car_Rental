const express = require("express");
const router = express.Router();
const { model, validate } = require("../models/model");

router.get("/", async (req, res) => {
  res.send(await model.find());
});

router.get("/:name", async (req, res) => {
  const m = await model.find({ name: req.params.name });
  if (!m) return res.status(400).send("Model not found");
  res.send(m);
});

router.post("/", async (req, res) => {
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

router.delete("/:name", async (req, res) => {
  res.send(await model.remove({ name: req.params.name }));
});

module.exports = router;
