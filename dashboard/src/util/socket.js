import socketio from 'socket.io-client';

const socket = socketio.connect(
  process.env.REACT_APP_SERVER_URL || 'http://localhost:8181'
);

socket.emit('clientAuth', process.env.REACT_APP_DASHBOARD_KEY || 'dashboardKey');

export default socket;