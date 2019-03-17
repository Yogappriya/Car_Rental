const winston = require("winston");
const mongoose = require("mongoose");

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: "error.log" }),
    new winston.transports.MongoDB({ db: "mongodb://localhost/car" })
  ]
});

module.exports = function() {
  mongoose
    .connect("mongodb://localhost/car", { useNewUrlParser: true })
    .then(() => logger.info("Connected to mongodb"));

  mongoose.set("useCreateIndex", true);
};
