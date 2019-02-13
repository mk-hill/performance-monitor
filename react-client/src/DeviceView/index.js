import React from 'react';
import Info from './Info';
import UsageIndicator from './UsageIndicator';
import styled from 'styled-components';

const ViewBox = styled.div`
  box-sizing: border-box;
  position: relative;
  color: ${props => (props.isOffline ? '#ccc' : '#000')};
  border: ${props => (props.isOffline ? '1px solid red' : '1px solid #bbb')};
  border-radius: 10px;
  margin: 10px;
  background: linear-gradient(
    114.02807334855652deg,
    rgba(246, 245, 245, 0.6) 4.775390625%,
    rgba(220, 220, 220, 0.6) 98.13476562499999%
  );
  box-shadow: 2px 2px 5px 2px rgba(50, 70, 90, 0.2);
  text-align: center;
  padding: 0.8rem;
  min-width: 900px;
  max-width: 1400px;

  display: flex;

  h3,
  h4 {
    margin: 0;
    position: absolute;
  }

  h4 {
    right: 0.8rem;
  }
`;

const OfflineText = styled.h3`
  /* margin: 0; */
  /* position: absolute; */
  display: block;
  font-size: 3rem;
  color: red;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
`;

const Widget = ({ data }) => {
  const {
    mac,
    hostName,
    osType,
    model,
    speed,
    cores,
    updateInterval,
    totalMem,
    freeMem,
    upTime,
    memUsage,
    cpuUsage,
    isOffline,
  } = data;

  return (
    <ViewBox isOffline={isOffline}>
      {isOffline ? <OfflineText>Offline</OfflineText> : null}
      <h3>{hostName}</h3>
      <h4>{osType}</h4>
      <UsageIndicator
        title="CPU Usage"
        value={cpuUsage}
        isOffline={isOffline}
      />
      <UsageIndicator
        title="Memory Usage"
        value={memUsage}
        isOffline={isOffline}
      />
      <Info
        data={{
          model,
          speed,
          cores,
          updateInterval,
          totalMem,
          upTime,
          freeMem,
        }}
      />
    </ViewBox>
  );
};

export default Widget;
