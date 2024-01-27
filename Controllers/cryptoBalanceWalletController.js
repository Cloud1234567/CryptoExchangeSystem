const db = require("../Models");
const User = db.users;
const cryptoBalanceWallet = db.cryptoBalanceWallet;

const createCryptoWallet = async (req, res) => {
  try {
    const { userId } = req.params;
    const { cryptoId, amount } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const cryptoWallet = await cryptoBalanceWallet.create({
      userId: userId,
      cryptoId: cryptoId,
      amount: amount,
    });

    return res.status(201).send(cryptoWallet);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createCryptoWallet };
