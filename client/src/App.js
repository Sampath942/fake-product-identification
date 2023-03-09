import 'bootstrap/dist/css/bootstrap.min.css';
import { ethers } from 'ethers';
import {  useState,useEffect } from 'react';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import AddProduct from './components/AddProduct';
import ListProducts from './components/ListProducts';
import NotFound from './components/NotFound';
import ScanProduct from './components/ScanProduct';
import Welcome from './components/Welcome';


function App() {
  return (
    <Router>
    
    <Routes>
      <Route exact path="/" element={<Welcome />}/>
    <Route exact path="/add" element={<AddProduct />} />
    <Route exact path="/list" element={<ListProducts />} />
    <Route exact path="/scan" element={<ScanProduct />} />
    <Route path="*" element={<NotFound />}/>
    </Routes>
    </Router>
  );
}

export default App;
