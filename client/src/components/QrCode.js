import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";

function QrCode({ data }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    console.log(data);
    QRCode.toCanvas(canvasRef.current, data);
  }, [data]);

  const handleDownloadClick = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");

    // Create a temporary link and download the data URL
    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
      <button onClick={handleDownloadClick}>Download QR Code</button>
    </div>
  );
}

export default QrCode;
