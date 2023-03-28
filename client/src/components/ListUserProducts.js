import './listproducts.css';
import { ethers } from "ethers"
import fpi from "../fpi.json";
import { useState,useEffect,useRef } from 'react';
import AddUser from './AddUser';
import Modal from 'react-modal';



const ListUserProducts = ({account}) => {
    const [Fpi,setFpi] = useState(null);
    const [provider,setProvider] = useState(null);
    const [useritems,setUserItems] = useState(null);
    const [loading,setLoading] = useState(true);
    const [userName,setUserName] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [recipientAddress, setRecipientAddress] = useState('');
    const Card = ({ id,pname, f1, f2, f3, f4, f5 }) => {
      console.log(pname,f1,f2,f3,f4,f5);
      const handleTransferClick = () => {
        setModalIsOpen(true);
      };
    
      return (
        <div className='card'>
          <h2>{id+1}. {pname}</h2>
          <ul>
            <li>{f1}</li>
            <li>{f2}</li>
            <li>{f3}</li>
            <li>{f4}</li>
            <li>{f5}</li>
          </ul>
          <button onClick={handleTransferClick}>Transfer</button>
        </div>
      );
    };
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
          //console.log(Fpi);
          const useritems=await Fpi._listAllUserItems(account);
          setUserItems(useritems);
          //console.log(useritems);
          const UserName = await Fpi._getOwnerToName(account);
          //console.log(UserName);
          setUserName(UserName);
          
        };

        loadProvider();
        setLoading(false);
       },[account]);

       
  Modal.setAppElement('#root');
  
  const handleModalClose = () => {
    setModalIsOpen(false);
  };

  const handleRecipientAddressChange = (event) => {
    setRecipientAddress(event.target.value);
  };

  const handleTransferConfirm = async () => {
    console.log(`Transfer to ${recipientAddress} confirmed`);
    console.log(useritems);
    //console.log(id);
    //console.log(e);
    //await Fpi.transfer(account,recipientAddress);
    setRecipientAddress('');
    setModalIsOpen(false);
  };
        
  
    let obj=[];
    if(!loading && useritems){
    //console.log(useritems);
    let P_Name=useritems.names;
    let Key_Array=useritems.feature_keys;
    let Value_Array=useritems.feature_values;
    console.log(P_Name);
    for (let i=0;i<P_Name.length;i++)
    {       
      let f1=" "+Key_Array[i][0]+" : "+Value_Array[i][0]+" ";
      let f2=" "+Key_Array[i][1]+" : "+Value_Array[i][1]+" ";
      let f3=" "+Key_Array[i][2]+" : "+Value_Array[i][2]+" ";
      let f4=" "+Key_Array[i][3]+" : "+Value_Array[i][3]+" ";
      let f5=" "+Key_Array[i][4]+" : "+Value_Array[i][4]+" ";  
      obj.push([P_Name[i],f1,f2,f3,f4,f5] );
    }
    }

  return ( 
    <div className='your-component'>
      <div className='component-wrapper'>
      {loading && <div>....Loading</div>}
      {!loading && (!userName || userName==='') && <AddUser Fpi={Fpi} account={account} flag={1}/>}
         {!loading && (userName && userName!=='') && 
         <div>
         {obj.map((item, index) => (
           <Card 
             key={index}
             id={index}
             pname={item[0]}
             f1={item[1]}
             f2={item[2]}
             f3={item[3]}
             f4={item[4]}
             f5={item[5]}
           />
         ))}
       </div>}
        
         {!loading && <Modal isOpen={modalIsOpen} onRequestClose={handleModalClose}>
        <h2>Enter Recipient Address</h2>
        <input type="text" value={recipientAddress} onChange={handleRecipientAddressChange} />
        <button onClick={handleTransferConfirm}>Confirm</button>
        <button onClick={handleModalClose}>Cancel</button>
      </Modal>}
      </div>
    </div> 
   );
}

export default ListUserProducts;