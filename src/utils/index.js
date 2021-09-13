const DatauriParser = require('datauri/parser');
const path = require("path");
const cloudinary = require('../config/cloudinary');

// upload file to cloudinary
function uploader(req) {
    return new Promise((resolve, reject) => {
        const parser = new DatauriParser();
        let image = parser.format(path.extname(req.file.originalname).toString(), req.file.buffer);
        // console.log("image :", image)

        cloudinary.uploader.upload(image.content, (err, url) => {
            if (err) return reject(err);
            return resolve(url);
        })
    });
};

module.exports = { uploader };
