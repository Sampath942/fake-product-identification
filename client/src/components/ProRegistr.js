
import React,{ Component } from 'react'
import { Link } from "react-router-dom";
import { ethers } from "ethers"
import fpi from "../fpi.json";
import { useState,useEffect,useRef } from 'react';
import AddUser from './AddUser';
import QrCode from './QrCode';

const ProRegistr = ({account}) => {
 const [Fpi,setFpi] = useState(null);
 const [provider,setProvider] = useState(null);
 const [userName,setUserName] = useState(null);
 const [loading,setLoading] = useState(true);
 const [uniqueHash,setUniqueHash] = useState('');
 useEffect (() => {
  setLoading(true);
  const loadProvider= async () => {
    let contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const url="http://localhost:8545";
    const provider = new ethers.providers.JsonRpcProvider(url);
    const signer = provider.getSigner(0)
    const Fpi = new ethers.Contract(contractAddress,fpi.abi,signer);
    setFpi(Fpi);
    setProvider(provider);
    console.log(Fpi);
    const UserName = await Fpi._getOwnerToName(account);
    console.log(UserName);
    setUserName(UserName);
  };
  loadProvider();
  setLoading(false);
 },[]);

 const handleSubmit =  async(event)  => {
  console.log(account);
  event.preventDefault()
  // alert(`
  //   ___Your Details___\n
  //   key0: ${proname.current.value}
  //   key1: ${key1.current.value}
  //   key2: ${key2.current.value}
  //   key3: ${key3.current.value}
  //   key4: ${key4.current.value}
  //   key5: ${key5.current.value}
  //   feature1: ${val1.current.value}
  //   feature2: ${val2.current.value}
  //   feature3: ${val3.current.value}
  //   feature4: ${val4.current.value}
  //   feature5: ${val5.current.value}
  // `)
  const KeysArray =[key1.current.value,key2.current.value,key3.current.value,key4.current.value,key5.current.value];
  const valuesArray =[val1.current.value,val2.current.value,val3.current.value,val4.current.value,val5.current.value];
  const transaction = await Fpi._addItem(account,proname.current.value,KeysArray,valuesArray);
  const receipt = await transaction.wait();
  const uniqueHash = receipt.events[0].args.uniqueHash;
  console.log(transaction);
  console.log(receipt);
  console.log(uniqueHash);
  setUniqueHash(uniqueHash);

}
 
  const proname = useRef('');
  //proname.current.value;
  const key1=useRef('');
  const key2=useRef('');
  const key3=useRef('');
  const key4=useRef('');
  const key5=useRef('');
  const val1=useRef('');
  const val2=useRef('');
  const val3=useRef('');
  const val4=useRef('');
  const val5=useRef('');
  
  console.log(loading);
  console.log(account);
  console.log(userName);

  return (
    <>
    {loading && <div>Loading......</div>}
    {!loading && !userName && userName==='' && uniqueHash==='' &&<AddUser Fpi={Fpi} account={account} flag={0}/>}
        {!loading && userName && userName!=='' && uniqueHash==='' && <div className='dd'>
      <form onSubmit={handleSubmit}>

                <div className="cards">
                    <h4>Enter the Product details here </h4>
                </div>

                <div className='zero'>
          {/* <label htmlFor='key0'>Key0</label> */}
          <input 
            name='key0'
            placeholder='Name of the Product' 
            ref={proname}
          />
        </div>

        <div className='one'>
          {/* <label htmlFor='key1'>Key1</label> */}
          <input 
            name='key1'
            placeholder='key1' 
            ref={key1}
          />
        </div>
        <div className='six'>
          {/* <label htmlFor='feature1'>Feature1</label> */}
          <input 
            name='feature1'
            placeholder='feature1' 
            ref={val1}
          />
        </div>
        <div className='two'>
          {/* <label htmlFor='key2'>Key2</label> */}
          <input 
            name='key2'
            placeholder='key2' 
            ref={key2}
          />
        </div>

        <div className='seven'>
          {/* <label htmlFor='feature2'>feature2</label> */}
          <input 
            name='feature2'
            placeholder='feature2' 
            ref={val2}
          />
        </div>


        <div className='three'>
          {/* <label htmlFor='key3'>Key3</label> */}
          <input 
            name='key3'
            placeholder='key3' 
            ref={key3}
          />
        </div>

        <div className='eight'>
          {/* <label htmlFor='feature3'>feature3</label> */}
          <input 
            name='feature3'
            placeholder='feature3' 
            ref={val3}
          />
        </div>

        <div className='four'>
          {/* <label htmlFor='key4'>Key4</label> */}
          <input 
            name='key4'
            placeholder='key4' 
            ref={key4}
          />
        </div>
        
        <div className='nine'>
          {/* <label htmlFor='feature4'>feature4</label> */}
          <input 
            name='feature4'
            placeholder='feature4' 
            ref={val4}
          />
        </div>
        
        <div className='five'>
          {/* <label htmlFor='key5'>Key5</label> */}
          <input 
            name='key5'
            placeholder='key5' 
            ref={key5}
          />
        </div>

        <div className='ten'>
          {/* <label htmlFor='feature5'>feature5</label> */}
          <input 
            name='feature5'
            placeholder='feature5' 
            ref={val5}
          />
          </div>
        
        <div className='button'>
          <button>Submit details</button>
        </div>
      </form>
      </div>}
      {!loading && userName && userName!=='' && uniqueHash!=='' && <QrCode data={JSON.stringify(uniqueHash)}/>}
    </>
  )
} 


export default ProRegistr;
 