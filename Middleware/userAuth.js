const express = require("express");
const db = require("../Models");

const User = db.users;
const saveUser = async (req, res, next) => {
  try {
    const username = await User.findOne({
      where: {
        username: req.body.userName,
      },
    });

    if (username) {
      return res.json(409).send("username already taken");
    }

    const emailCheck = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (emailCheck) {
      return res.json(409).send("email already taken");
    }

    return next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error });
  }
};

module.exports = { saveUser };
