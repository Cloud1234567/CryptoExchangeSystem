const express = require("express");

const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes.js");
const fiatBalanceWalletRoutes = require("./routes/fiatBalanceWalletRoutes.js");
const cryptoBalanceWalletRoutes = require("./routes/cryptoBalanceWalletRoutes.js");
const cryptoCurrencyRoutes = require("./routes/cryptoCurrencyRoutes.js");

const transactionRoutes = require("./routes/transactionRoutes.js");
const db = require("./Models");
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

db.sequelize.sync({ force: true }).then(() => {
  console.log("db has been re sync");
});

app.use(userRoutes);
app.use(fiatBalanceWalletRoutes);
app.use(cryptoBalanceWalletRoutes);
app.use(cryptoCurrencyRoutes);

app.use(transactionRoutes);

app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
