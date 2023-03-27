import './listproducts.css';
import { ethers } from "ethers"
import fpi from "../fpi.json";
import { useState,useEffect,useRef } from 'react';
import AddUser from './AddUser';

const ListUserProducts = ({account}) => {
    const [Fpi,setFpi] = useState(null);
    const [provider,setProvider] = useState(null);
    const [useritems,setUserItems] = useState(null);
    const [loading,setLoading] = useState(true);
    const [userName,setUserName] = useState(null);

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
          const useritems=await Fpi._listAllUserItems(account);
          setUserItems(useritems);
          console.log(useritems);
          const UserName = await Fpi._getOwnerToName(account);
          console.log(UserName);
          setUserName(UserName);
          
        };

        loadProvider();
        setLoading(false);
       },[account]);
        
    const Card = ( pname , f1 , f2 , f3 , f4 , f5) => { return { pname : pname , f1 : f1, f2 : f2, f3 : f3 , f4 : f4 , f5 : f5 } }
    let obj=[];
    if(!loading && useritems){
    console.log(useritems);
    let P_Name=useritems.names;
    let Key_Array=useritems.feature_keys;
    let Value_Array=useritems.feature_values;
      
    for (let i=0;i<P_Name.length;i++)
    {       
      let f1=" "+Key_Array[i][0]+" : "+Value_Array[i][0]+" ";
      let f2=" "+Key_Array[i][1]+" : "+Value_Array[i][1]+" ";
      let f3=" "+Key_Array[i][2]+" : "+Value_Array[i][2]+" ";
      let f4=" "+Key_Array[i][3]+" : "+Value_Array[i][3]+" ";
      let f5=" "+Key_Array[i][4]+" : "+Value_Array[i][4]+" ";  
      obj.push(Card(P_Name[i],f1,f2,f3,f4,f5) );
    }
    }

  return ( 
    <div>
      {!loading && (!userName || userName==='') && <AddUser Fpi={Fpi} account={account} flag={1}/>}
         {!loading && (userName && userName!=='') && <table className="center">
            <thead>
              <tr>
                  <th> Product_Name </th>
                  <th> Factor1 </th>
                  <th> Factor2 </th>
                  <th> Factor3 </th>
                  <th> Factor4 </th>
                  <th> Factor5 </th>
  
              </tr>
            </thead>
  
            <tbody>
              {
                obj.map((val,i) =>
                <tr key={i}>
                  <td> {val.pname}</td>
                  <td> {val.f1} </td>
                  <td> {val.f2} </td>
                  <td> {val.f3} </td>
                  <td> {val.f4} </td>
                  <td> {val.f5} </td>
  
                </tr>
                )
              }
            </tbody>
         </table>}
         {loading && <div>....Loading</div>}

    </div> 
   );
}

export default ListUserProducts;