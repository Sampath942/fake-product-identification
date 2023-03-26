import { useState } from "react";
import React from 'react'
import Button from 'react-bootstrap/Button';

import { QRCodeCanvas } from "qrcode.react";

const QrCode = () => {
  const [url, setUrl] = useState("www.google.com");
  const [qr, setQr] = useState("www.google.com")
  const downloadQRCode = (e) => {
    e.preventDefault();
    setUrl("");
  };

  const qrCodeEncoder = (e) => {
    setUrl(e.target.value);
  };

  const qrcode = (
    <QRCodeCanvas
      id="qrCode"
      value={url}
      size={300}
      bgColor={"#00ff00"}
      level={"H"}
    />
  );
  return (
    <div className="qrcode__container">
      <div className="qrimage">{qrcode}</div>
      <div className="input__group">
        <form onSubmit={downloadQRCode}>
          {/* <label>Enter URL</label>
          <input
            type="text"
            value={url}
            onChange={qrCodeEncoder}
          /> */}
          {/* <button className="bu" type="submit" variant="contained" onClick={downloadQRCode} disabled={!url}>
            Download QR Code
          </button> */}
          { qr && (
            <>
            {/* <img src={qr} /> */}
            <Button className="bu"
             variant = "contained"
             color = "success"
             href={qr}
             download={qrcode}>Download QR Code</Button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default QrCode;