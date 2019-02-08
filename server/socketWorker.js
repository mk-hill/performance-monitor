const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/perfData', { useNewUrlParser: true });

function socketWorker(server, socket) {
  console.log(`socketWorker engaged for ${socket.id}`);
  socket.on('clientAuth', (key) => {
    const nodeKey = process.env.NODE_KEY || 'nodeClientKey';
    const reactKey = process.env.REACT_KEY || 'reactClientKey';
    if (key === nodeKey) {
      socket.join('nodeClients');
    } else if (key === reactKey) {
      socket.join('reactClients');
    } else {
      socket.disconnect(true);
    }
  });

  socket.on('initialData', (initialData) => {
    console.log(initialData);
  });
  socket.on('perfData', (perfData) => {
    console.log(perfData);
  });
}

module.exports = socketWorker;
