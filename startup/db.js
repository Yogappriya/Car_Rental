const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: "error.log" }),
    new winston.transports.MongoDB({ db: "mongodb://localhost/car" })
  ]
});

module.exports = function() {
  const db = config.get("db");
  mongoose
    .connect(config.get("db"), { useNewUrlParser: true })
    .then(() => logger.info(`Connected to ${db}`));

  mongoose.set("useCreateIndex", true);
};
