const express = require('express');
const router = express.Router();
//get controller functions from controllers index
const { login, getLogin, getProfile} = require("../controllers/index");

router.get("/", getLogin);
router.get("/profile", getProfile);
router.post("/login", login);

module.exports = router;