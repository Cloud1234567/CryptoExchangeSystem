module.exports = (sequelize, DataTypes) => {
  const fiatBalanceWallet = sequelize.define("fiatBalanceWallet", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fiatId: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
    },
  });

  return fiatBalanceWallet;
};
