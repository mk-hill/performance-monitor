import React, { Component } from 'react';
import './App.css';
import DeviceView from './DeviceView';

import socket from './util/socket';

// How long to wait in addition to update interval before assuming device is offline
const timeout = 2000;

class App extends Component {
  constructor() {
    super();
    this.state = {
      devices: {},
    };
  }

  // using each device's mac address instead of generating uuid
  // access in constant time + same identifier on reconnect
  updateDevice = perfData => {
    this.setState({
      devices: {
        ...this.state.devices,
        [perfData.mac]: {
          ...perfData,
          lastUpdate: Date.now(),
        },
      },
    });
    console.log(perfData);
  };

  componentDidMount() {
    socket.on('data', this.updateDevice);
  }

  render() {
    const { devices } = this.state;
    return (
      <div className="App">
        {Object.keys(devices).map(macAddress => {
          const deviceData = devices[macAddress];
          const isOffline =
            Date.now() >
            deviceData.lastUpdate + Number(deviceData.updateInterval) + timeout;
          return <DeviceView data={{ ...deviceData, isOffline }} />;
        })}
      </div>
    );
  }
}

export default App;
