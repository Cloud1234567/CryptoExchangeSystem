const express = require("express");
const transactionController = require("../Controllers/transactionController.js");
const { createTransaction } = transactionController;

const router = express.Router();

router.post("/createtransaction/:senderUserId", createTransaction);
module.exports = router;
