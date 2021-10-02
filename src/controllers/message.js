const Message = require("../models/message");

// @route POST api/messages
// @desc Store New Message
// @access Public
exports.store = async (req, res) => {
    const newMessage = new Message(req.body);

    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @route GET api/messages
// @desc Get Message
// @access Public
exports.index = async (req, res) => {
    try{
        // const messages = await Message.find({
        //     conversationId: req.params.conversationId
        // });

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skipIndex = (page - 1) * limit;
        const messages = await Message
            .find({conversationId: req.params.conversationId})
            .sort({ 'createdAt': 'desc', "_id": 1 })
            .skip(skipIndex)
            .limit(limit)
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
