import React from 'react';
import styled from 'styled-components';

const UsageWrapper = styled.div`
  margin: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h5,
  h6 {
    margin: 0;
    font-size: 2rem;
  }
`;

const UsageIndicator = ({ title, value }) => {
  return (
    <UsageWrapper>
      <h5>{title}</h5>
      <h6>{value}%</h6>
    </UsageWrapper>
  );
};

export default UsageIndicator;
