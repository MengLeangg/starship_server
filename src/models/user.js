
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new Schema({
    first_name: { type: String, trim: true, required: true },
    last_name: { type: String, trim: true, required: true },
    // username: { type: String, required: true, unique: true, lowercase: true, trim : true, index : true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: null },
    online: { type: Boolean },
    online_at: { type: Date },
    created_at: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, { expiresIn: '365d' });
    return token;
};

userSchema.virtual('full_name').get(function () {
    return [this.first_name, this.last_name].filter(Boolean).join(' ');
});

const User = mongoose.model("user", userSchema);

const validate = (user) => {
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    return schema.validate(user);
};

module.exports = { User, validate };
