import './listproducts.css';
import { ethers } from "ethers"
import fpi from "../fpi.json";
import { useState,useEffect,useRef } from 'react';
import AddUser from './AddUser';
import Modal from 'react-modal';


const Card = ({ pname, f1, f2, f3, f4, f5, _from, _ids, curr_id, Fpi, setUserItems }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [recipientAddress, setRecipientAddress] = useState('');
    const [errorMessage,setErrorMessage] = useState('');
    Modal.setAppElement('#root');
    const handleModalClose = () => {
      setModalIsOpen(false);
    };
  
    const handleRecipientAddressChange = (event) => {
      setRecipientAddress(event.target.value);
    };
    const handleTransferClick = () => {
      setRecipientAddress('');
      setModalIsOpen(true);
      setErrorMessage('');
    }
    const handleTransferConfirm = async (e) => {
      console.log(`Transfer to ${recipientAddress} confirmed`);
      //console.log(useritems);
      //console.log(e);
    //   console.log(Fpi);
    //   console.log(_ids[curr_id]);
    //   console.log(recipientAddress);
      //console.log(await Fpi._getOwnerToName(_from));
      if(ethers.utils.isAddress(recipientAddress)){
        const transaction = await Fpi._transfer(_from,recipientAddress,_ids[curr_id]);
        const receipt = await transaction.wait();
        const argsLength = receipt.events.length;
        if(argsLength>0)
        {
            setErrorMessage('User with the entered address is not registered. Please re-check the address you entered');
            setRecipientAddress('');
        }
        else{
            setErrorMessage('')
            setModalIsOpen(false);
            const useritems=await Fpi._listAllUserItems(_from);
            setUserItems(useritems)
        }
      }
      else{
        console.log('wrong address');
        setErrorMessage('The address you have entered is not a valid address');
        setRecipientAddress('');
      }
      
      //await Fpi._transfer(_from,recipientAddress,_ids[curr_id]);
      
      
    };
    return (
      <div>
      {modalIsOpen && <Modal isOpen={modalIsOpen} onRequestClose={handleModalClose}>
      <h2>Enter Recipient Address</h2>
      <input type="text" value={recipientAddress} onChange={handleRecipientAddressChange} />
      <button onClick={handleTransferConfirm}>Confirm</button>
      <button onClick={handleModalClose}>Cancel</button>
      <br></br>
      <br></br>
      {errorMessage.length>0 && errorMessage}
    </Modal>}
      {!modalIsOpen && <div className='card center'>
        <h2>{pname}</h2>
        <ul>
          <li>{f1}</li>
          <li>{f2}</li>
          <li>{f3}</li>
          <li>{f4}</li>
          <li>{f5}</li>
        </ul>
        <button onClick={handleTransferClick}>Transfer</button>
      </div>}
      </div>
    );
  };

  export default Card;