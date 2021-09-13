const mongoose = require("mongoose");
const chalk = require('chalk');

module.exports = async () => {
    try {
        const connectionParams = {
            useUnifiedTopology: true,
            useNewUrlParser: true
        };
        await mongoose.connect(process.env.MONGO_URI, connectionParams);
        console.log(chalk.green("connected to database."));
    } catch (error) {
        console.log(chalk.red("could not connect to database"), error);
    }
};
