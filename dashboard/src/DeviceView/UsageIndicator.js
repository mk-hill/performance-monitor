import React from 'react';
import styled from 'styled-components';

const UsageWrapper = styled.div`
  margin: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: max-content;

  h5,
  h6 {
    margin: 0;
    font-size: 2rem;
  }
`;

const UsageBar = styled.div`
  margin: 1rem 0;
  height: 15%;
  width: 10rem;
  border: 1px solid #777;
  border-radius: 5px;
`;

const InnerBar = styled.div`
  height: 100%;
  transition: all 0.5s ease, opacity 0.05s linear;
  background-color: ${({ value }) =>
    `rgb(${value * 2.1},${255 - value * 2.4},${0})`};
  width: ${props => props.value}%;
  opacity: ${props => (props.isOffline ? 0 : 1)};
`;

const UsageIndicator = ({ title, value, isOffline }) => {
  return (
    <UsageWrapper>
      <h5>{title}</h5>
      <UsageBar>
        <InnerBar value={value} isOffline={isOffline} />
      </UsageBar>
      <h6>{value}%</h6>
    </UsageWrapper>
  );
};

export default UsageIndicator;
