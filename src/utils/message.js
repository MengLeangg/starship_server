const moment = require('moment');

const formatMessage = (data) => {
    const message = {
        from:    data.fromUser,
        to:      data.toUser,
        message: data.msg,
        date: moment().format("YYYY-MM-DD"),
        time: moment().format("hh:mm a")
    }
    return message;
}
module.exports=formatMessage;
