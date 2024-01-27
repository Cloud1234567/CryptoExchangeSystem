const express = require("express");
const userController = require("../Controllers/userController.js");
const { signup, login, findUser } = userController;
const userAuth = require("../Middleware/userAuth.js");
const router = express.Router();

router.post("/signup", userAuth.saveUser, signup);

router.post("/login", login);

router.get("/user/:id", findUser);
module.exports = router;
