const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { user, validate } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
  const u = await user.findById(req.user._id).select("-password");
  res.send(u);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(404).send(error.details[0].message);
  }

  let u = await user.findOne({ email: req.body.email });
  if (u) return res.status(400).send("user already registered");

  //_.pick will only return the objects in the array
  u = new user(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  u.password = await bcrypt.hash(u.password, salt);
  await u.save();

  const token = u.generateAuthToken();

  res.header("x-auth-token", token).send(_.pick(u, ["name", "email", "id"]));
});

module.exports = router;
