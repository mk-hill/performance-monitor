import React from 'react';

const UsageIndicator = ({ title, value }) => {
  return (
    <div>
      <h5>{title}</h5>
      <h6>{value}%</h6>
    </div>
  );
};

export default UsageIndicator;
