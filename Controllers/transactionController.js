const db = require("../Models");
const transaction = db.transaction;
const User = db.users;
const cryptoCurrency = db.cryptoCurrency;
const cryptoBalanceWallet = db.cryptoBalanceWallet;
const fiatBalanceWallet = db.fiatBalanceWallet;
const createTransaction = async (req, res) => {
  try {
    const { senderUserId } = req.params;
    const { transactionType } = req.body;

    const user = await User.findByPk(senderUserId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (transactionType === "buy" || transactionType === "sell") {
      const {
        cryptoId,
        fiatId,
        fiatBalanceWalletId,
        cryptoBalanceWalletId,
        amount,
      } = req.body;

      const pairOfFiatPerCrypto = `${cryptoId}To${fiatId}`;
      const totalFiatAmount = await calculateTotalFiatAmount(
        pairOfFiatPerCrypto,
        amount
      );
      //create transaction
      const Transaction = await transaction.create({
        senderUserId: senderUserId,
        transactionType: transactionType,
        pairOfFiatPerCrypto: pairOfFiatPerCrypto,
        amount: amount,
      });
      if (transactionType === "buy") {
        const fiatBalance = await fiatBalanceWallet.findOne({
          where: { id: fiatBalanceWalletId, fiatId },
        });

        if (!fiatBalance || fiatBalanceWallet.amount < totalFiatAmount) {
          return res.status(400).send("Insufficient fiat balance");
        }
        await fiatBalance.decrement("amount", { by: totalFiatAmount });
        const cryptoBalance = await cryptoBalanceWallet.findOne({
          where: { id: cryptoBalanceWalletId, cryptoId },
        });

        if (!cryptoBalance) {
          return res.status(400).send("You don't have this crypto wallet");
        }

        await cryptoBalance.increment("amount", { by: amount });

        return res.send("Cryptocurrency bought successfully");
      } else if (transactionType === "sell") {
        const cryptoBalance = await cryptoBalanceWallet.findOne({
          where: { id: cryptoBalanceWalletId, cryptoId },
        });

        if (!cryptoBalance || cryptoBalanceWallet.amount < amount) {
          return res.status(400).send("Insufficient crypto balance");
        }
        await cryptoBalance.decrement("amount", { by: amount });
        const fiatBalance = await fiatBalanceWallet.findOne({
          where: { id: fiatBalanceWalletId, fiatId },
        });
        if (!fiatBalance) {
          return res.status(400).send("You don't have this crypto wallet");
        }
        await fiatBalance.increment("amount", { by: totalFiatAmount });
        return res.send(Transaction);
      }
    } else if (transactionType === "trade") {
      const {
        senderCryptoId,
        receiverCryptoId,
        senderCryptoBalanceWalletIdDecrease,
        senderCryptoBalanceWalletIdIncrease,
        receiverCryptoBalanceWalletIdDecrease,
        receiverCryptoBalanceWalletIdIncrease,
        amount,
      } = req.body;

      const pairOfCryptoPerCrypto = `${senderCryptoId}To${receiverCryptoId}`;
      const { senderCryptoBalance, receiverCryptoBalance } =
        calculateTotalCryptoAmount(pairOfCryptoPerCrypto, amount);
      const Transaction = await transaction.create({
        senderUserId: senderUserId,
        transactionType: transactionType,
        pairOfCryptoPerCrypto: pairOfCryptoPerCrypto,
        amount: amount,
      });

      const senderCryptoBalanceDecrease = await cryptoBalanceWallet.findOne({
        where: {
          id: senderCryptoBalanceWalletIdDecrease,
        },
      });
      const senderCryptoBalanceIncrease = await cryptoBalanceWallet.findOne({
        where: {
          id: senderCryptoBalanceWalletIdIncrease,
        },
      });

      const receiverCryptoBalanceDecrease = await cryptoBalanceWallet.findOne({
        where: {
          id: receiverCryptoBalanceWalletIdDecrease,
        },
      });
      const receiverCryptoBalanceIncrease = await cryptoBalanceWallet.findOne({
        where: {
          id: receiverCryptoBalanceWalletIdIncrease,
        },
      });

      if (
        !receiverCryptoBalanceDecrease ||
        receiverCryptoBalanceDecrease.amount < receiverCryptoBalance
      ) {
        return res.status(400).send("Insufficient crypto balance");
      }

      if (
        !senderCryptoBalanceDecrease ||
        senderCryptoBalanceDecrease.amount < senderCryptoBalance
      ) {
        return res.status(400).send("Insufficient crypto balance");
      }
      console.log(receiverCryptoBalanceIncrease);
      await senderCryptoBalanceDecrease.decrement("amount", {
        by: senderCryptoBalance,
      });
      await receiverCryptoBalanceIncrease.increment("amount", {
        by: senderCryptoBalance,
      });
      await receiverCryptoBalanceDecrease.decrement("amount", {
        by: receiverCryptoBalance,
      });
      await senderCryptoBalanceIncrease.increment("amount", {
        by: receiverCryptoBalance,
      });
      return res.send(Transaction);
    }
  } catch (error) {
    console.log(error);
  }
};

async function calculateTotalFiatAmount(pairOfFiatToCrypto, amount) {
  const findPair = await cryptoCurrency.findOne({
    where: { pairOfFiatPerCrypto: pairOfFiatToCrypto },
  });

  if (!findPair) {
    throw new Error("Pair of crypto and fiat not found");
  }
  return findPair.rateFiatToCrypto * amount;
}

async function calculateTotalCryptoAmount(pairOfCryptoPerCrypto, amount) {
  const findPair = await cryptoCurrency.findOne({
    where: { pairOfCryptoPerCrypto: pairOfCryptoPerCrypto },
  });

  if (!findPair) {
    throw new Error("Pair of crypto are not found");
  }
  const senderCryptoBalance = findPair.rateCryptoToCrypto * amount;
  const receiverCryptoBalance = amount;
  return { senderCryptoBalance, receiverCryptoBalance };
}

module.exports = { createTransaction };
