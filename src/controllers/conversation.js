const Conversation = require("../models/conversation");

// @route POST api/conversations
// @desc Store New Conversation
// @access Public
exports.store = async (req, res) => {
    const newConversation = new Conversation({
        members: [ req.body.senderId, req.body.receiverId ],
    });

    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @route GET api/conversations
// @desc Get Conversation Of User
// @access Public
exports.index = async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in:[req.params.userId] },
        }).sort({ timestamp : -1 })

        res.status(200).json(conversation);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
