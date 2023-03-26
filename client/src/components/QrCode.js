
import React from 'react'
import Button from 'react-bootstrap/Button';

import { QRCodeCanvas } from "qrcode.react";

const QrCode = ({hashString}) => {
  

  const qrcode = (
    <QRCodeCanvas
      id="qrCode"
      value={hashString}
      size={300}
      bgColor={"#00ff00"}
      level={"H"}
    />
  );
  return (
    <div className="qrcode__container">
      <div className="qrimage">{qrcode}</div>
      <div className="input__group">
        
      </div>
    </div>
  );
};

export default QrCode;