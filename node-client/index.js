/* eslint-disable class-methods-use-this */

/**
 * Capture local performance data,
 * Send it to socket.io server
 *
 * - Name
 * - CPU load
 * - Memory usage
 * -- free
 * -- total
 * - OS
 * - uptime
 * - CPU info
 */

const os = require('os');
const socketio = require('socket.io-client');

const socket = socketio(process.env.SERVER_URL || 'http://localhost:8181');

class PerfMon {
  constructor(updateInterval = 1000) {
    const osNames = {
      Darwin: 'macOS',
      Windows_NT: 'Windows',
    };

    this.updateInterval = updateInterval; // ms interval to report updates
    this.osType = os.type() in osNames ? osNames[os.type()] : os.type();
    this.totalMem = os.totalmem(); // in bytes
    this.hostName = os.hostname();

    // need unique identifier for this device, will use non-internal mac address
    this.mac = Object.values(os.networkInterfaces()).find(
      arr => !arr[0].internal && arr[0].mac !== '00:00:00:00:00:00',
    )[0].mac;

    const {
      length: cores, // number of logical cores
      0: { model, speed }, // speed in MHz
    } = os.cpus(); // returns array

    this.cpu = { model, speed, cores };

    this.lastCoreTimes = this.avgCoreTimes; // save core times at the time of instantiation
  }

  // In seconds, to be formatted
  get upTime() {
    return os.uptime();
  }

  // In bytes, to be formatted
  get freeMem() {
    return os.freemem();
  }

  // In bytes, to be formatted
  get usedMem() {
    return this.totalMem - this.freeMem;
  }

  // Returning percentage value (0-100)
  get memUsage() {
    return Math.floor((this.usedMem / this.totalMem) * 100);
  }

  // Return average total uptime and idle time per core in ms
  get avgCoreTimes() {
    // cpus returns all logical cores in array
    const cpus = os.cpus();

    // Total uptime and idle time spent for all cores
    const { total, idle } = cpus.reduce(
      (time, core) => {
        time.total += Object.values(core.times).reduce((x, y) => x + y);
        time.idle += core.times.idle;
        return time;
      },
      { total: 0, idle: 0 },
    );

    // Divide totals by number of cores to return avg
    return {
      total: total / cpus.length,
      idle: idle / cpus.length,
    };
  }

  // Compare avg total & idle time from last check to now
  // Update last check values to current
  // Returning percentage value (0-100)
  get cpuUsage() {
    const start = this.lastCoreTimes;
    const end = this.avgCoreTimes;

    const totalDiff = end.total - start.total;
    const idleDiff = end.idle - start.idle;
    const usagePercentage = 100 - Math.floor((100 * idleDiff) / totalDiff);

    this.lastCoreTimes = end;
    return usagePercentage;
  }

  // Static data which only needs to be sent once
  get initialData() {
    return {
      mac: this.mac,
      hostName: this.hostName,
      osType: this.osType,
      ...this.cpu,
      totalMem: this.totalMem,
      updateInterval: this.updateInterval,
    };
  }

  // Data updated each tick
  get tickData() {
    return {
      freeMem: this.freeMem,
      upTime: this.upTime,
      memUsage: this.memUsage,
      cpuUsage: this.cpuUsage,
    };
  }

  get allData() {
    return {
      ...this.initialData,
      ...this.tickData,
    };
  }

  init(connection) {
    // Log locally if not connected to server
    if (!connection) {
      console.log(this.initialData);
      setInterval(() => {
        console.log(this.tickData);
      }, this.updateInterval);
    } else {
      console.log(`Connected to ${connection.id}, updates handled by socket.`);
    }
  }
}

const monitor = new PerfMon(process.env.UPDATE_INTERVAL || 1000);

socket.on('connect', () => {
  monitor.init(socket);

  // Authorize client
  socket.emit('clientAuth', process.env.NODE_KEY || 'nodeClientKey');

  socket.emit('initialData', monitor.initialData); // send initial payload

  // sending all data for now, consider sending only tick data if
  // network load needs to be reduced
  const sendPerfDataInterval = setInterval(() => {
    socket.emit('perfData', monitor.allData);
  }, monitor.updateInterval);

  socket.on('disconnect', () => {
    clearInterval(sendPerfDataInterval);
  });
});
