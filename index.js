const express = require("express");
const app = express();
const Joi = require("joi");
const model = require("./routes/model");
const customers = require("./routes/customers");
const cars = require("./routes/cars");
const rental = require("./routes/rental");
const user = require("./routes/user");
const login = require("./routes/login");
const mongoose = require("mongoose");
Joi.objectId = require("joi-objectid")(Joi);
const config = require("config");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR : jwtPrivateKey is not defined");
  process.exit(1);
}

//edited here

mongoose
  .connect("mongodb://localhost/car", { useNewUrlParser: true })
  .then(() => console.log("Connected to mongodb"))
  .catch(() => console.log("Could not connect to MongoDB"));

app.use(express.json());
app.use("/api/models", model);
app.use("/api/customers", customers);
app.use("/api/cars", cars);
app.use("/api/rentals", rental);
app.use("/api/users", user);
app.use("/api/login", login);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`listening in port${port}`);
});
