const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "postgres", // Specify the dialect, in this case, PostgreSQL
  database: "CryptoExchange", // Specify the name of the database
  username: "postgres", // Specify the username
  password: "rednewsi12", // Specify the password
  host: "localhost", // Specify the host
  port: 5432, // Specify the port
  logging: false, // Disable logging
  sync: true, // Synchronize models with the database, set to false if you don't want Sequelize to alter the database schema
});

sequelize
  .authenticate()
  .then(() => {
    console.log(`Database connected to CryptoExchange`);
  })
  .catch((err) => {
    console.log(err);
  });

//put data in database
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./userModel")(sequelize, DataTypes);
db.fiatBalanceWallet = require("./fiatBalanceWalletModel")(
  sequelize,
  DataTypes
);
db.cryptoBalanceWallet = require("./cryptoBalanceWalletModel")(
  sequelize,
  DataTypes
);
db.transaction = require("./transactionModel")(sequelize, DataTypes);
db.cryptoCurrency = require("./cryptoCurrencyModel")(sequelize, DataTypes);

//associated
db.users.hasMany(db.fiatBalanceWallet, {
  foreignKey: "userId",
});

db.fiatBalanceWallet.belongsTo(db.users, {
  foreignKey: "userId",
});

db.users.hasMany(db.cryptoBalanceWallet, {
  foreignKey: "userId",
});

db.cryptoBalanceWallet.belongsTo(db.users, {
  foreignKey: "userId",
});

db.users.hasMany(db.transaction, {
  foreignKey: "senderUserId",
});
db.transaction.belongsTo(db.users, {
  foreignKey: "senderUserId",
});

module.exports = db;
