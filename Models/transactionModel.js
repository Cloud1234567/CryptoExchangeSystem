module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define("transaction", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    transactionType: {
      type: DataTypes.STRING,
    },
    senderUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    pairOfFiatPerCrypto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pairOfCryptoPerCrypto: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    amount: {
      type: DataTypes.DECIMAL,
    },
  });

  return transaction;
};
