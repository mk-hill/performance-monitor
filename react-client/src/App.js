import React, { Component } from 'react';
import './App.css';
import styled from 'styled-components';
import DeviceView from './DeviceView';

import socket from './util/socket';

// How long to wait in addition to update interval before assuming device is offline
const timeout = process.env.REACT_APP_TIMEOUT || 2000;

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 1rem;
  height: 100vh;
  background: linear-gradient(
    161.17139062810975deg,
    rgba(167, 204, 225, 1) 5.224088350321647%,
    rgba(236, 246, 237, 1) 91.34693138430077%
  );

  display: flex;
  flex-direction: column;
  align-items: center;
`;

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
    // console.log(perfData);
  };

  componentDidMount() {
    socket.on('data', this.updateDevice);
  }

  render() {
    const { devices } = this.state;
    return (
      <Wrapper>
        <h1>Connected Devices</h1>
        {Object.keys(devices).map(mac => {
          const { lastUpdate, updateInterval, ...deviceData } = devices[mac];
          // isOffline if it has been longer than updateInterval + timeout wait since last update
          const isOffline = Date.now() > lastUpdate + updateInterval + timeout;
          return <DeviceView key={mac} data={{ ...deviceData, isOffline }} />;
        })}
      </Wrapper>
    );
  }
}

export default App;
