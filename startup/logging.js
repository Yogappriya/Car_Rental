const winston = require("winston");
require("express-async-errors");

const logger = winston.createLogger({
  transports: [new winston.transports.File({ filename: "error.log" })],
  exceptionHandlers: [
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "exceptions.log" })
  ],
  exitOnError: false
});

module.exports = function() {};

process.on("uncaughtException", err => {
  logger.warn(err.message, err);
});

process.on("unhandledRejection", err => {
  logger.error(err.message, err);
});
