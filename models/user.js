const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 10,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024
  }
});
const user = new mongoose.model("users", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
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
  return Joi.validate(user, schema);
}

exports.user = user;
exports.userSchema = userSchema;
exports.validate = validateUser;
