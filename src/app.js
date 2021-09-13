require('dotenv').config();
const connection = require('./config/db');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } }); // Create socket.io connection
const cors = require("cors");
const bodyParser = require("body-parser");
const chalk = require('chalk');


// controllers
// const User = require("./controllers/user");

// Models mongodb
// const Message = require("./models/message");

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
let user_id = null;
io.on('connection', (socket) => {

    // handle user login online
    socket.on('login', (_id) => {
        // user_id = _id;
        // User.userOnline(_id, true);
    });


    // Handles "message" event sent by client
    socket.emit('message', "Welcome to starship");

    // Broadcast when user connects
    socket.broadcast.emit('message', 'A user has joined the chat');

    // Listen for chatMessage
    socket.on('chatMessage', message => {
        io.emit('message', message);
    });

    // Client Disconnected
    socket.on('disconnect', () => {
        // console.log("user disconnected")
        // update user to offline
        // User.userOnline(user_id, false);

        io.emit('message', 'A user has left the chat');
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(chalk.blue(`Running on port: http://localhost:${PORT}`)));
