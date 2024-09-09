const express = require('express');
const router = express.Router();

//get controller functions from controllers index
const { login, getLogin, getProfile, getProfileEditor, editProfile, editPfp, getAdminUI, lockUser, unlockUser} = require("../controllers/index");

//Middlewares
const handleFileUploadError = require("../middlewares/upload");
const isAdminCheck = require("../middlewares/isAdmin");

router.get("/", getLogin);

router.get("/profile", getProfile);

router.post("/login", login);

router.get('/profile_editor', getProfileEditor); 

router.post('/profile/edit', editProfile);

router.post('/profilePic-edit', editPfp); 

router.get('/adminUI', isAdminCheck, getAdminUI);

router.post('/user/:id/lock', lockUser);

router.post('/user/:id/unlock', unlockUser);

module.exports = router;