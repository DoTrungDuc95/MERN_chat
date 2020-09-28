const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const test = users.includes((u) => u.name === name && u.room === room);
  if (test) {
    return { error: 'Username is taken' };
  }

  const user = { id, name, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((u) => u.id === id);
  if (index >= 0) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => users.find((u) => u.id === id);

const getUsersInRoom = (room) => users.filter((u) => u.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
