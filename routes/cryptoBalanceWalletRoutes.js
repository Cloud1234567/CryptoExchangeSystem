const express = require("express");
const cryptoBalanceController = require("../Controllers/cryptoBalanceWalletController.js");
const { createCryptoWallet } = cryptoBalanceController;

const router = express.Router();

router.post("/createcryptowallet/:userId", createCryptoWallet);
module.exports = router;
