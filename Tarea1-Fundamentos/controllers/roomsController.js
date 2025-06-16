const path = require('path');
const { readJsonFile } = require('../utils/fileController');

const roomsPath = path.join(__dirname, '../data/rooms.json');

function listRooms(res) {
  const rooms = readJsonFile(roomsPath);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(rooms));
}

module.exports = { listRooms };
