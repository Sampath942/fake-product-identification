import React, {useState, useEffect} from 'react'
import {ethers} from 'ethers'
import { Link, redirect } from "react-router-dom";
import "./components.css";

const WalletCardEthers = () => {


	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Wallet connect');
	const [provider, setProvider] = useState(null);

	

	const connectWalletHandler = () => {
		if (window.ethereum && defaultAccount == null) {
			// set ethers provider
			setProvider(new ethers.providers.Web3Provider(window.ethereum));

			// let provider = new ethers.providers.Web3Provider(web3.currentProvider);

			// connect to metamask
			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				setConnButtonText('Wallet Connected');
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

	useEffect(() => {
		if(defaultAccount){
		provider.getBalance(defaultAccount)
		.then(balanceResult => {
			setUserBalance(ethers.utils.formatEther(balanceResult));
		})
		};
	}, [defaultAccount]);


	redirect(() => {
		
	})

			
		return (
			<>
			<div className='bg2'>
			<div className='walletCard'>
			<h4> Connection to MetaMask using ethers.js </h4>
			</div>
			<div className='click'>
				<button onClick={connectWalletHandler}>{connButtonText}</button>
				</div>
				<div className='account'>
				<div className='accountDisplay'>
					<h3>Address: {defaultAccount}</h3>
				</div>
				<div className='balanceDisplay'>
					<h3>Balance: {userBalance}</h3>
				</div>
				</div>
				<div className='redirect1'>
					{defaultAccount != null ? (<button className="btn btn-success m-2">Product List</button>): (<div></div>)}	
				</div>
				{errorMessage}
				</div>
				</>
		);
}

export default WalletCardEthers;