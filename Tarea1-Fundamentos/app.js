const http = require('http');
const url = require('url');
const { listRooms } = require('./controllers/roomsController');
const {
  listReservations,
  createReservation,
  deleteReservation
} = require('./controllers/reservationsController');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.method === 'GET' && parsedUrl.pathname === '/rooms') {
    listRooms(res);
    return;
  }

  if (req.method === 'GET' && parsedUrl.pathname === '/reservations') {
    listReservations(res);
    return;
  }

  if (req.method === 'POST' && parsedUrl.pathname === '/reservations') {
    createReservation(req, res);
    return;
  }

  if (req.method === 'DELETE' && parsedUrl.pathname.startsWith('/reservations/')) {
    const reservationId = parsedUrl.pathname.split('/')[2];
    deleteReservation(req, res, reservationId);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Not found' }));
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
