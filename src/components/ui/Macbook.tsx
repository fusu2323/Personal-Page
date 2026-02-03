import React from 'react';
import './Macbook.css';

export const Macbook: React.FC = () => {
  return (
    <div className="macbook select-none scale-75 md:scale-100 transition-transform duration-500">
      <div className="inner">
        <div className="screen">
          <div className="face-one">
            <div className="camera"></div>
            <div className="display">
              <div className="shade"></div>
            </div>
            <span>LIN HONGJI</span>
          </div>
          <p className="logo">L</p>
        </div>
        <div className="body">
          <div className="face-one">
            <div className="touchpad"></div>
            <div className="keyboard">
              <div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div>
              <div className="key space"></div>
              <div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div>
              <div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div>
              <div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div>
              <div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div>
              <div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div>
              <div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div>
              <div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div>
              <div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div><div className="key"></div>
              <div className="key f"></div><div className="key f"></div><div className="key f"></div><div className="key f"></div><div className="key f"></div>
              <div className="key f"></div><div className="key f"></div><div className="key f"></div><div className="key f"></div><div className="key f"></div>
              <div className="key f"></div><div className="key f"></div><div className="key f"></div><div className="key f"></div><div className="key f"></div>
              <div className="key f"></div>
            </div>
          </div>
          <div className="pad one"></div>
          <div className="pad two"></div>
          <div className="pad three"></div>
          <div className="pad four"></div>
        </div>
      </div>
      <div className="shadow"></div>
    </div>
  );
};
