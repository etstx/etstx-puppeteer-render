const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const app = express();

const SERVER_NAME = process.env.SERVER_NAME || "ETS-TX";
const SERVER_PORT = process.env.SERVER_PORT || 4000;

app.get("/scrape", (req, res) => {
  scrapeLogic(res, SERVER_NAME, SERVER_PORT);
});

app.get("/", (req, res) => {
  res.send(`Puppeteer is running on the ${SERVER_NAME} Server on Port ${SERVER_PORT}.`);
});

app.listen(SERVER_PORT, () => {
  console.log(`The ${SERVER_NAME} Server is running on Port ${SERVER_PORT}.`);
});
