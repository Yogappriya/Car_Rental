const mongoose = require("mongoose");
const Joi = require("joi");

const modelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20
  }
});
const model = new mongoose.model("model", modelSchema);

function validateModel(model) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(20)
      .required()
  };
  return Joi.validate(model, schema);
}

exports.model = model;
exports.modelSchema = modelSchema;
exports.validate = validateModel;
