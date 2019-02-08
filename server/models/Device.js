const mongoose = require('mongoose');

const { Schema } = mongoose;

const Device = new Schema({
  mac: String,
  hostName: String,
  model: String,
  speed: Number,
  cores: Number,
  updateInterval: Number,
  totalMem: Number,

  upTime: Number,
  freeMem: Number,
  memUsage: Number,
  cpuUsage: Number,
});

module.exports = mongoose.model('Device', Device);
