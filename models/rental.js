const mongoose = require("mongoose");
const Joi = require("joi");

const rentalSchema = new mongoose.Schema({
  car: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      dailyRentalRate: {
        type: Number,
        required: true
      }
    })
  },
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      isGold: {
        type: Boolean,
        default: false
      },
      phone: {
        type: Number,
        required: true
      }
    })
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: { type: Date, default: null },
  rentFee: Number
});

const rental = new mongoose.model("rentals", rentalSchema);

function validateRental(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    carId: Joi.objectId().required()
  };
  return Joi.validate(rental, schema);
}

exports.rental = rental;
exports.rentalSchema = rentalSchema;
exports.validate = validateRental;
