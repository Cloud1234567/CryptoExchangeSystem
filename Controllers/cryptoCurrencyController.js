const db = require("../Models");
const cryptoCurrency = db.cryptoCurrency;
const createCryptoCurrency = async (req, res) => {
  try {
    const {
      cryptoId,
      fiatId,
      rateFiatToCrypto,
      senderCryptoId,
      receiverCryptoId,
      rateCryptoToCrypto,
    } = req.body;

    if (cryptoId) {
      const rateCryptoCurrency = await cryptoCurrency.create({
        pairOfFiatPerCrypto: `${cryptoId}To${fiatId}`,
        rateFiatToCrypto: rateFiatToCrypto,
      });

      return res.status(201).send(rateCryptoCurrency);
    } else if (senderCryptoId) {
      const rateCryptoCurrency = await cryptoCurrency.create({
        pairOfCryptoPerCrypto: `${senderCryptoId}To${receiverCryptoId}`,
        rateCryptoToCrypto: rateCryptoToCrypto,
      });
      return res.status(201).send(rateCryptoCurrency);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createCryptoCurrency };
