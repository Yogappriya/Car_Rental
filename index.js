const express = require("express");
const app = express();
const winston = require("winston");

require("./startup/logging");
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config");
require("./startup/validation");

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: "error.log" }),
    new winston.transports.MongoDB({ db: "mongodb://localhost/car" })
  ]
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  logger.info(`listening in port${port}`);
});
