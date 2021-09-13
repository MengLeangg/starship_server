const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Conversation = require('../controllers/conversation');

// store new conversation
router.post('/', auth, Conversation.store);

// get conversation of user
router.get('/:userId', auth, Conversation.index);

module.exports = router;
