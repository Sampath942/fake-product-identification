// import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import { Link } from "react-router-dom";
import "./components.css";
import {ethers} from 'ethers';
import React, {useState} from 'react'
import ProRegistr from "./ProRegistr";
import ListUserProducts from "./ListUserProducts";

const ListProducts = () => {
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
	
	const [provider, setProvider] = useState(null);
    const connectWalletHandler = () => {
		if (window.ethereum && defaultAccount == null) {
			// set ethers provider
			setProvider(new ethers.providers.Web3Provider(window.ethereum));

			// let provider = new ethers.providers.Web3Provider(web3.currentProvider);

			// connect to metamask
			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				setDefaultAccount(result[0]);
			})
		 	.catch(error => {
				setErrorMessage(error.message);
			});

		} else if (!window.ethereum){
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
		
	}
    return (
        
        <div className="card">
            {defaultAccount && <ListUserProducts account={defaultAccount}/>}
            {!defaultAccount && <div className="card-content">
                <div className="card-title">
                    <h4>Link to your Ethereum wallet </h4>
                </div>
                <div className="col-md-12">
                    <button className="btn btn-success m-2" onClick={connectWalletHandler}>Connect</button>
                </div>
                </div>}
            
        
                
        </div> 
    );
}

export default ListProducts;