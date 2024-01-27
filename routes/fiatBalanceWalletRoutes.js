const express = require("express");
const fiatBalanceController = require("../Controllers/fiatBalanceWalletController.js");
const { createfiatWallet } = fiatBalanceController;

const router = express.Router();

router.post("/createfiatwallet/:userId", createfiatWallet);
module.exports = router;
