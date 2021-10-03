require('dotenv').config();
const connection = require('./config/db');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } }); // Create socket.io connection
const cors = require("cors");
const bodyParser = require("body-parser");
require('./prod')(app);
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
const onlineUsers = {};

io.on('connection', (socket) => {
    // console.log("a user connected")
    // when connected
    // when user online
    socket.on('login', (data) => {
        onlineUsers[socket.id] = data.userId;
        User.updateUserOnline(data.userId, true) // update user online params (user_id, status)
        // io.emit("getUsers", getUsers())
        io.emit('online', { userId: data.userId })
    })

    // Emit user offline from client
    socket.on("offline", (data) => {
        User.updateUserOnline(data.userId, false)
        io.emit('offline');
    })

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

    // user create new conversation then refresh conversation list
    socket.on('new-conversation', () => {
        io.emit('refresh-conversation')
    })

    // send and receive message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getCurrentUser(receiverId);
        io.to(user ? user.socketId : null).emit('getMessage', {
            senderId,
            text
        })
    })

    // when disconnect
    socket.on("disconnect", () => {
        // console.log("a user disconnected.")
        userLeave(socket.id)
        // io.emit("getUsers", getUsers())

        // when user offline
        // remove saved socket from users object
        const offlineUserId = onlineUsers[socket.id];
        User.updateUserOnline(offlineUserId, false) // update user online params (user_id, status)
        io.emit('offline');
    })
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(chalk.blue(`Running on port: http://localhost:${PORT}`)));
