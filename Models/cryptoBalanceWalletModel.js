module.exports = (sequelize, DataTypes) => {
  const cryptoBalanceWallet = sequelize.define("cryptoBalanceWallet", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cryptoId: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
    },
  });

  return cryptoBalanceWallet;
};
