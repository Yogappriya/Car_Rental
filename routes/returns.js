const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { rental } = require("../models/rental");
const { car } = require("../models/cars");
const Joi = require("joi");

router.post("/", auth, async (req, res) => {
  if (!req.body.customerId)
    return res.status(400).send("customer id not provided");
  if (!req.body.carId) return res.status(400).send("car id not provided");

  var rent = await rental.findOne({
    "customer._id": req.body.customerId,
    "car._id": req.body.carId
  });
  if (!rent) return res.status(404).send("No rental is found ");

  if (rent.endDate === null) {
    rent.endDate = new Date();
    rent.rentFee =
      rent.car.dailyRentalRate *
      parseInt((rent.endDate - rent.startDate) / (1000 * 60 * 60 * 24));
    await rent.save();

    const c = await car.findById(req.body.carId);
    const count = c.numberAvailable;
    c.numberAvailable = count + 1;

    await c.save();

    return res.status(200).send(rent);
  }

  return res.status(400).send("Return has already been processed");
});

function validateReturn(req) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };
  return Joi.validate(req, schema);
}

module.exports = router;
