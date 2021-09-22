let users = [];

// Get all users
function getUsers() {
    return users
}

// Add user to chat
function addUser(userId, socketId) {
    !users.some(user => user.userId  === userId) && users.push({ userId, socketId })
}

// Get current user
function getCurrentUser(userId) {
    return users.find(user => user.userId === userId);
}


// User leaves chat
function userLeave(socketId) {
    users = users.filter(user => user.socketId !== socketId)
}

// Get user leave chat
function getUserLeave(socketId) {
    return users.filter(user => user.socketId === socketId)
}

module.exports = { getUsers, addUser, getCurrentUser, userLeave, getUserLeave };
