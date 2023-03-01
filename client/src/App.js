import 'bootstrap/dist/css/bootstrap.min.css';
import { ethers } from 'ethers';
import {  useState,useEffect } from 'react';


function App() {
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div class="text-center">
        <button className="btn btn-primary m-2">Add Item</button>
        <button className="btn btn-primary m-2">List Items</button>
        <button className="btn btn-primary m-2">Scan QR</button>
      </div>
    </div>
  );
}

export default App;
