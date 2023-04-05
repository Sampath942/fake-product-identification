import React, { useState,useEffect } from 'react';
import fpi from "../fpi.json";
import { Decoder } from '@nuintun/qrcode';
import { ethers } from "ethers"


const QrCodeScanner = () => {
    const [Fpi,setFpi] = useState(null);
    const [provider,setProvider] = useState(null);
    useEffect(() => {
        const loadProvider= async () => {
            let contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
            const url="http://localhost:8545";
            const provider = new ethers.providers.JsonRpcProvider(url);
            const signer = provider.getSigner(0)
            const Fpi = new ethers.Contract(contractAddress,fpi.abi,signer);
            setFpi(Fpi);
            setProvider(provider);
            //console.log(Fpi);
          };
          loadProvider();

    },[])
  const [result, setResult] = useState([]);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleFileScan = async() => {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
      const qrcode = new Decoder();

        qrcode
        .scan(reader.result)
        .then (async result => {
            //console.log(result.data);
            const json = JSON.parse(result.data);
            //console.log(json);
            const hashString = json['hex'];
            //setResult(hashString);
            console.log(Fpi);
            setResult(await Fpi.getHistory(hashString));
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
      {result && 
        <div>
            <ul>
         { result.length>0 && result.map((transaction, index) => (
            <li key={index}>{transaction}</li>
          ) )}
          </ul>
        </div>
      }
    </div>
  );
};

export default QrCodeScanner;
