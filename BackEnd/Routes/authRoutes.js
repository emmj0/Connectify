const express = require("express");
const router = express.Router();
const { register, login, logout, deleteAccount } = require("../Controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.delete("/delete", deleteAccount);

module.exports = router;
