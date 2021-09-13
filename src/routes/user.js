const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../controllers/user");
const multer = require('multer');
const upload = multer().single('avatar');

// GET USERS
router.get('/', auth, User.index);

// GET USER LOGGED
router.get("/me", auth, User.me);

// GET USER BY ID
router.get('/:id', auth, User.show)

// UPDATE
router.put('/:id', upload, User.update);

module.exports = router;
