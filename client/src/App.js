import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
// import {  useState,useEffect } from 'react';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import ScanProduct from './components/ScanProduct';
import NotFound from './components/NotFound';
import Welcome from './components/Welcome';
import WalletConnect from './components/WalletConnect';





function App() {
  
  return (
    <Router>
    
    <Routes>
    <Route exact path="/" element={<Welcome />}/>
    <Route exact path="/add" element={<WalletConnect flag={0} />} />
    <Route exact path="/list" element={<WalletConnect flag={1} />} />
    <Route exact path="/scan" element={<ScanProduct />} />
    <Route path="*" element={<NotFound />}/>
    </Routes>
    </Router>
  );
}

export default App;
