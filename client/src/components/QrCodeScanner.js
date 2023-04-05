import React, { useState } from 'react';

import { Decoder } from '@nuintun/qrcode';

const QrCodeScanner = () => {
  const [result, setResult] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleFileScan = () => {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        
        const qrcode = new Decoder();

qrcode
  .scan(reader.result)
  .then(result => {
    console.log(result.data);
    const json = JSON.parse(result.data);
    console.log(json);
    const hashString = json['hex'];
    setResult(hashString);
  })
  .catch(error => {
    console.error(error);
  });
        
      };
    }
  };

  return (
    <div className="qr-scanner">
      <label htmlFor="qr-file-input">Select a QR code image:</label>
      <input id="qr-file-input" type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleFileScan}>Scan QR code</button>
      {result && (
        <div>
          <p>Result:</p>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default QrCodeScanner;
