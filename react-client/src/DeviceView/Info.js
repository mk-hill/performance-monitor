import React from 'react';

const Info = ({ data }) => {
  return (
    <div>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
};

export default Info;
