const auth = require('./auth');
const user = require('./user');
const conversations = require('./conversation');
const messages = require('./messages');

const authenticate = require('../middleware/auth');

module.exports = app => {

    // Start API Route
    app.get('/', (req, res) => {
        res.send('Welcome to Starship application');
    });
    app.get('/api', (req, res) => {
        res.status(200).send({ message: "Welcome to the AUTHENTICATION API. Register or Login to test Authentication" });
    });

    // Authentication Route
    app.use('/api/auth', auth);

    // User Route
    app.use('/api/user', authenticate, user);

    // Conversations Route
    app.use('/api/conversations', authenticate, conversations);

    // Messages Route
    app.use('/api/messages', authenticate, messages);
};
