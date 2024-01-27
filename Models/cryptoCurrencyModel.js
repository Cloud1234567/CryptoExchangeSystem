module.exports = (sequelize, DataTypes) => {
  const cryptoCurrency = sequelize.define("cryptoCurrency", {
    pairOfFiatPerCrypto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rateFiatToCrypto: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    pairOfCryptoPerCrypto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rateCryptoToCrypto: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
  });

  return cryptoCurrency;
};
