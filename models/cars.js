const mongoose = require("mongoose");
const Joi = require("joi");
const { modelSchema } = require("./model");

const carSchema = new mongoose.Schema({
  name: String,
  carNumber: String,
  numberAvailable: Number,
  dailyRentalRate: Number,
  model: modelSchema
});

const car = new mongoose.model("cars", carSchema);

function validateCar(car) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(50)
      .trim()
      .required(),
    carNumber: Joi.string().required(),
    numberAvailable: Joi.required(),
    dailyRentalRate: Joi.required(),
    modelId: Joi.objectId().required()
  };
  return Joi.validate(car, schema);
}

exports.car = car;
exports.carSchema = carSchema;
exports.validate = validateCar;
