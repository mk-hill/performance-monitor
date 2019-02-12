const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/perfData', { useNewUrlParser: true });
const Device = require('./models/Device');

function socketWorker(server, socket) {
  console.log(`socketWorker engaged for ${socket.id}`);
  let mac; // will keep track of mac address

  socket.on('clientAuth', (key) => {
    const nodeKey = process.env.NODE_KEY || 'nodeClientKey';
    const reactKey = process.env.REACT_KEY || 'reactClientKey';
    if (key === nodeKey) {
      console.log('Node client connected.');
      socket.join('nodeClients');
    } else if (key === reactKey) {
      console.log('React client connected.');
      socket.join('reactClients');
    } else {
      console.log('Client key rejected.');
      socket.disconnect(true);
    }
  });

  socket.on('initialData', async (initialData) => {
    // Update socket scoped mac address
    mac = initialData.mac;
    const mongooseResult = await checkAndAdd(initialData);
    console.log(`${mongooseResult} ${mac}.`);

    // Check db to see if record already exists
    console.log(initialData);
  });
  socket.on('perfData', (perfData) => {
    console.log(mac, perfData);
    server.to('reactClients').emit('data', perfData);
  });
}

// check DB and add if not already added
function checkAndAdd(data) {
  return new Promise((resolve, reject) => {
    Device.findOne({ mac: data.mac }, (err, doc) => {
      if (err) {
        throw err;
      } else if (doc === null) {
        // not in db, add it
        const newDevice = new Device(data);
        newDevice.save();
        resolve('Added');
      } else {
        // already in db
        resolve('Found');
      }
    });
  });
}

module.exports = socketWorker;
