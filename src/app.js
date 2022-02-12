const express = require("express");
const pino = require("pino-http");
const service = require("./service.js");

// Express setup
const app = express();
const logger = pino();
app.use(express.json());
app.use(logger);
const port = process.env.PORT || 8080;

/**
 * Standardized headers for all requests
 */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

/**
 * Routes
 */
app.get("/", async (req, res) => {
  res.status(200).send();
});

app.post("/", async (req, res) => {
  await service.run();
  res.status(200).send();
});

app.listen(port, () => console.log(`Listening on port ${port}`));
