const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 30,
    required: true
  },
  isGold: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 15
  }
});

const customer = new mongoose.model("customer", customerSchema);

function validateCustomer(customer) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    phone: Joi.string()
      .min(5)
      .max(15)
      .required(),
    isGold: Joi.boolean()
  };
  return Joi.validate(customer, schema);
}

exports.customer = customer;
exports.customerSchema = customerSchema;
exports.validate = validateCustomer;
