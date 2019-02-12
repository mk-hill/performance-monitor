import React from 'react';
import Info from './Info';
import UsageIndicator from './UsageIndicator';

const Widget = ({ data }) => {
  const {
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
  } = data;
  return (
    <div>
      <h3>{data.hostName}</h3>
      <h4>{data.osType}</h4>
      <UsageIndicator title="CPU Usage" value={cpuUsage} />
      <UsageIndicator title="Memory Usage" value={memUsage} />
      <Info data={{ model, speed, cores, updateInterval, totalMem }} />
    </div>
  );
};

export default Widget;
