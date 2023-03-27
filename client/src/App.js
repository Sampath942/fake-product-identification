import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
// import {  useState,useEffect } from 'react';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import AddProduct from './components/AddProduct';
import ListProducts from './components/ListProducts';
import ScanProduct from './components/ScanProduct';
import NotFound from './components/NotFound';
import QrCode from './components/QrCode';
import Welcome from './components/Welcome';

import ProRegistr from './components/ProRegistr';




function App() {
  
  return (
    <Router>
    
    <Routes>
    <Route exact path="/" element={<Welcome />}/>
    <Route exact path="/add" element={<AddProduct />} />
    <Route exact path="/list" element={<ListProducts />} />
    <Route exact path="/scan" element={<ScanProduct />} />
    <Route exact path="/ProRegistr" element={<ProRegistr />} />
    <Route exact path="/QrCode" element={<QrCode />} />
    <Route path="*" element={<NotFound />}/>
    </Routes>
    </Router>
  );
}

export default App;
