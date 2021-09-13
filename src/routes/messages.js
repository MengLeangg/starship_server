const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Message = require('../controllers/message');

// store new message
router.post('/', auth, Message.store);

// get message of user
router.get('/:conversationId', auth, Message.index);

module.exports = router;
