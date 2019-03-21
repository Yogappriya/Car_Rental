const express = require("express");
const model = require("../routes/model");
const customers = require("../routes/customers");
const cars = require("../routes/cars");
const rental = require("../routes/rental");
const user = require("../routes/user");
const login = require("../routes/login");
const returns = require("../routes/returns");
const error = require("../middleware/error");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/models", model);
  app.use("/api/customers", customers);
  app.use("/api/cars", cars);
  app.use("/api/rentals", rental);
  app.use("/api/users", user);
  app.use("/api/login", login);
  app.use("/api/returns", returns);
  app.use(error);
};
