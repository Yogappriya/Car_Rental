const winston = require("winston");
require("winston-mongodb");

module.exports = function(err, req, res, next) {
  const logger = winston.createLogger({
    transports: [
      new winston.transports.File({
        filename: "error.log",
        timestamp: true,
        json: true
      }),
      new winston.transports.MongoDB({
        db: "mongodb://localhost/car",
        level: "info",
        timestamp: true,
        json: true
      })
    ]
  });
  logger.error(err.message, err);
  return res.status(500).send("Something went wrong");
};
