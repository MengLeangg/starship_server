require('dotenv').config();
const connection = require('./config/db');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } }); // Create socket.io connection
const cors = require("cors");
const bodyParser = require("body-parser");
const chalk = require('chalk');
const { getUsers, addUser, getCurrentUser, userLeave } = require('./utils/users');

// controllers
const User = require("./controllers/user");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/api/user/uploaded', function(req, res){
    const body = req.body;
    res.status(200).send(body)
});

connection(); // connection to mongodb database

//Configure Route
require('./routes/index')(app);

// ********** Socket listen for client connection ********** //

io.on('connection', (socket) => {
    // when connected
    // when user online
    socket.on('login', function(data){
        User.userOnline(data.userId, true)
    });
    // take userId and socketId from user
    socket.on("addUser", userId => {
        addUser(userId, socket.id)
        io.emit("getUsers", getUsers())
    })

    /*from server side we will emit 'display' event once the user starts typing
    so that on the client side we can capture this event and display
    '<data.user> is typing...' */
    socket.on('typing', (data) => {
        // console.log("data typing :", data);
        io.emit("displayTyping", data);
    })

    // // Stop Typing
    // socket.on("stopTyping", (data) => {
    //     io.emit("notifyStopTyping", {
    //         userId: data.userId,
    //         typing: data.typing
    //     });
    // })

    // send and receive message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getCurrentUser(receiverId);
        io.to(user.socketId).emit('getMessage', {
            senderId,
            text
        })
    })

    // when disconnect
    socket.on("disconnect", () => {
        // console.log("a user disconnected.")
        userLeave(socket.id)
        io.emit("getUsers", getUsers())

        // when user offline
    })
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(chalk.blue(`Running on port: http://localhost:${PORT}`)));
