const db = require("../Models");
const User = db.users;
const fiatBalanceWallet = db.fiatBalanceWallet;

const createfiatWallet = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fiatId, amount } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const fiatWallet = await fiatBalanceWallet.create({
      userId: userId,
      fiatId: fiatId,
      amount: amount,
    });

    return res.status(201).send(fiatWallet);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createfiatWallet };
