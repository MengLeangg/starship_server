const { User } = require("../models/user");
const { uploader } = require('../utils/index');

// @route GET api/user/me
// @desc GET user logged
// @access Public
exports.me = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password -__v");
        res.status(200).json({ user: user });
    } catch (error) {
        res.status(400).send(error);
    }
};

// @route GET api/user
// @desc GET user logged
// @access Public
exports.index = async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
};

// @route GET api/user/{id}
// @desc Returns a specific user
// @access Public
exports.show = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) return res.status(401).json({ message: 'User does not exist' });
        res.status(200).json(user);
    }catch (error) {
        res.status(500).json({message: error.message})
    }
};

// @route PUT api/user/{id}
// @desc Update user details
// @access Public
exports.update = async (req, res) => {
    try {
        const update = req.body;
        const id = req.params.id;
        const userId = req.user._id;

        //Make sure the passed id is that of the logged in user
        if (userId.toString() !== id.toString())
            return res.status(401).json({message: "Sorry, you don't have the permission to upd this data."});

        if (!req.file) {
            const user = await User.findByIdAndUpdate(id, {$set: update}, {new: true});

            //if there is no image, return success message
            // if (!req.file) return res.status(200).json({user, message: 'User has been updated'});
            res.status(200).json({user, message: 'User has been updated'});
        }

        //Attempt to upload to cloudinary
        const result = await uploader(req);
        // console.log("result :", result);

        const user_ = await User.findByIdAndUpdate(id, {
            first_name: update.first_name,
            last_name: update.last_name,
            avatar: result.secure_url,
            online: update.online
        }, {new: true});

        res.status(200).json({ user: user_, message: 'User has been updated' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.userOnline = async (_id, status) => {
    // console.log("_id :", _id)
    // console.log("status :", status)
    if (_id) {
        await User.findByIdAndUpdate(_id, {
            online: status
        }, {new: true});
    }
};
