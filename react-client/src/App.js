import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DeviceView from './DeviceView';

import socket from './util/socket';

class App extends Component {
  constructor() {
    super();
    this.state = {
      devices: {},
    };
  }

  updateDevice = perfData => {
    this.setState({
      devices: {
        ...this.state.devices,
        [perfData.mac]: perfData,
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
        {Object.keys(devices).map(macAddress => (
          <DeviceView data={devices[macAddress]} />
        ))}
      </div>
    );
  }
}

export default App;
