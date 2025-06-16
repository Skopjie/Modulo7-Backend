const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { readJsonFile, writeJsonFile } = require('../utils/fileController');

const roomsPath = path.join(__dirname, '../data/rooms.json');
const reservationsPath = path.join(__dirname, '../data/reservations.json');

function listReservations(res) {
  const reservations = readJsonFile(reservationsPath);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(reservations));
}

function createReservation(req, res) {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const { roomId, timeSlot, userName } = JSON.parse(body);
      if (!roomId || !timeSlot || !userName) {
        res.writeHead(400);
        res.end(JSON.stringify({ message: 'Missing data' }));
        return;
      }
      const rooms = readJsonFile(roomsPath);
      const reservations = readJsonFile(reservationsPath);
      const room = rooms.find(r => r.id === roomId);
      if (!room) {
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'Room not found' }));
        return;
      }

      const overlapping = reservations.filter(
        r => r.roomId === roomId && r.timeSlot === timeSlot
      );

      if (overlapping.length > 0) {
        const sameUser = overlapping.every(r => r.userName === userName);
        if (!sameUser) {
          res.writeHead(400);
          res.end(JSON.stringify({ message: 'This timeslot is already reserved by another user.' }));
          return;
        }

        if (overlapping.length >= room.maxCapacity) {
          res.writeHead(400);
          res.end(JSON.stringify({ message: 'Room capacity exceeded.' }));
          return;
        }
      }

      const newReservation = {
        id: uuidv4(),
        roomId,
        roomName: room.name,
        timeSlot,
        userName
      };
      reservations.push(newReservation);
      writeJsonFile(reservationsPath, reservations);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newReservation));
    } catch (err) {
      res.writeHead(400);
      res.end(JSON.stringify({ message: 'Invalid data format' }));
    }
  });
}


function deleteReservation(req, res, reservationId) {
  const reservations = readJsonFile(reservationsPath);
  const index = reservations.findIndex(r => r.id === reservationId);
  if (index === -1) {
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Reservation not found' }));
    return;
  }
  reservations.splice(index, 1);
  writeJsonFile(reservationsPath, reservations);

  res.writeHead(204);
  res.end();
}

module.exports = { listReservations, createReservation, deleteReservation };
