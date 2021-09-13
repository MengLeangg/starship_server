const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

// Login Validate
const loginValidate = (user) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    return schema.validate(user);
};

// @route POST api/auth/register
// @desc Register user
// @access Public
exports.register = async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check if the user is allready in the db
    const emailExists = await User.findOne({ email: req.body.email });

    if (emailExists) return res.status(400).json({ message: `An account with Email ${req.body.email} already exists.` });

    // hash passwords
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hashPassword
    });
    try {

        const savedUser = await user.save();
        res.status(200).json({ data: savedUser });

    } catch (error) {
        res.status(400).send(error);
    }
}

// @route POST api/auth/login
// @desc Login user and return JWT token
// @access Public
exports.login = async (req, res) => {
    try {
        const { error } = loginValidate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("Invalid credentials");

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword)
            return res.status(400).send("Invalid credentials");

        const token = user.generateAuthToken();
        res.status(200).json({ token: token });
    } catch (error) {
        res.status(400).send(error);
    }
}
