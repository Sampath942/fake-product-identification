
import { useState } from 'react';
import ListUserProducts from './ListUserProducts';
import ProRegistr from './ProRegistr';

const AddUser = ({Fpi,account,flag}) => {

    const [userName, setUserName] = useState('');
    const [buttonClicked,setButtonClicked] = useState(false);
  
    const handleChange = (event) => {
      setUserName(event.target.value);
    };
  
    const handleClick = async () => {
      await Fpi._addUser(account,userName);
      console.log("success");
      
      setButtonClicked(true);
      console.log(buttonClicked);
      console.log(flag);
    //   const UserName = await Fpi._getOwnerToName(account);
    //   console.log(UserName);
    };
  
    return (
     <> {buttonClicked===false &&  <div>
        <br></br>
        <input
          type="text"
          id="message"
          name="message"
          placeholder="Enter Username"
          onChange={handleChange}
          value={userName}
        />
  
  
  
        <button onClick={handleClick}>Update</button>
        <h2>Username : {userName}</h2>

      </div>}
      {buttonClicked===true && flag===0 && <ProRegistr account={account}/>}
      {buttonClicked===true && flag===1 && <ListUserProducts account={account}/>}
      </>
    );

}

export default AddUser;