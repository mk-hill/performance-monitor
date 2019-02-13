import React from 'react';
import styled from 'styled-components';

import { formatBytes, formatSeconds, formatMhz } from '../util/formatText';

const InfoList = styled.ul`
  margin: 1.6rem 1rem 1rem 1rem;
  list-style: none;
  text-align: left;
  li {
    margin-top: 0.4rem;
  }
`;

const Info = ({ data: { model, speed, cores, totalMem, upTime, freeMem } }) => {
  return (
    <InfoList>
      <li>Processor: {model.slice(0, 18)}</li>
      <li style={{ marginTop: 0, whiteSpace: 'pre-wrap' }}>
        {model.slice(18)}
      </li>
      <li>Clock Speed: {formatMhz(speed)}</li>
      <li>Logical Cores: {cores}</li>
      <li>Total Memory: {formatBytes(totalMem)}</li>
      <li>Free Memory: {formatBytes(freeMem)}</li>
      <li>Uptime: {formatSeconds(upTime)}</li>
    </InfoList>
  );
};

export default Info;
