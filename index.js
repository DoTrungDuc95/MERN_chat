const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const router = require('./router/router');
const {
  addUser,
  getUser,
  removeUser,
  getUsersInRoom,
} = require('./controllers/user');

const port = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = socketio(server);
io.on('connection', (socket) => {
  console.log('socket is running');

  socket.on('join', ({ name, room }, cb) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return cb(error);

    socket.emit('message', {
      user: 'Admin',
      text: `${user.name}, welcome to the room ${user.room}`,
    });
    socket.to(user.room).broadcast.emit('message', {
      user: 'Admin',
      text: `${user.name}, has joined`,
    });

    socket.join(user.room);

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    cb();
  });

  socket.on('sendMessage', (message, cb) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('message', { user: user.name, text: message });
    cb();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', {
        user: 'Admin',
        text: `${user.name} has left`,
      });
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

app.use(router);

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
