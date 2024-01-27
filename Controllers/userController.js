const bcrypt = require("bcrypt");
const db = require("../Models");
const jwt = require("jsonwebtoken");

const User = db.users;

const signup = async (req, res) => {
  try {
    const { userName, password, email } = req.body;
    const data = {
      username: userName,
      password: await bcrypt.hash(password, 10),
      email,
    };
    const user = await User.create(data);
    return res.status(201).send(user);
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      where: {
        username: username,
      },
    });

    if (user) {
      const isSame = await bcrypt.compare(password, user.password);
      if (isSame) {
        let token = jwt.sign({ id: user.id }, process.env.secretKey, {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        });
        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        return res.status(201).send(user);
      } else {
        return res.status(401).send("Authentication failed");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const findUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [db.fiatBalanceWallet],
    });

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { signup, login, findUser };
