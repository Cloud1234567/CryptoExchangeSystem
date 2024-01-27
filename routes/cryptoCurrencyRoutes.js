const express = require("express");
const cryptoCurrencyController = require("../Controllers/cryptoCurrencyController.js");
const { createCryptoCurrency } = cryptoCurrencyController;

const router = express.Router();

router.post("/createcryptocurrency", createCryptoCurrency);
module.exports = router;
