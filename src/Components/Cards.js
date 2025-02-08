import React from 'react';
import '../Styles/Cards.css';

function Card({title,count,icon}) {
  return (
    <div className="vehicle-card">
      <div className="card-content">
        <div className="card-info">
          <span className="card-title">{title}</span>
          <span className="card-count">{count}</span>
        </div>
        <div className="card-icon-wrapper">
          <div className="card-icon-container">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;