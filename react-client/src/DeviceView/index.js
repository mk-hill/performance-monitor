import React from 'react';
import Info from './Info';
import UsageIndicator from './UsageIndicator';

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
    lastUpdate,
    isOffline,
  } = data;

  return (
    <div>
      <h3>{data.hostName}</h3>
      <h4>{data.osType}</h4>
      <UsageIndicator title="CPU Usage" value={cpuUsage} />
      <UsageIndicator title="Memory Usage" value={memUsage} />
      <Info
        data={{
          model,
          speed,
          cores,
          updateInterval,
          totalMem,
          mac,
          upTime,
          lastUpdate,
          isOffline,
        }}
      />
    </div>
  );
};

export default Widget;
