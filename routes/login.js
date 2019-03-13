const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { user } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let u = await user.findOne({ email: req.body.email });
  if (!u) return res.status(400).send("Invalid email/password");

  const validPassword = await bcrypt.compare(req.body.password, u.password);
  if (!validPassword) return res.status(400).send("Invalid email/password");

  const token = jwt.sign({ _id: u._id }, config.get("jwtPrivateKey"));
  res.send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string()
      .min(10)
      .max(255)
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .max(1024)
      .required()
  };
  return Joi.validate(req, schema);
}

module.exports = router;
