// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "./DateTime.sol";

import "./Strings.sol";

// contract deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3

contract fpi {

    struct item {
        uint id;
        string name;
        mapping (string => string) features;
        string [] keys;
    }
    address constant public myAddress = 0xE0f5206BBD039e7b0592d8918820024e2a7437b9;
    mapping (address => uint[]) ownerItems;
    mapping (address => string) OwnerToName;
    mapping (uint => address) itemToOwner;
    mapping (uint => uint) hashToId;
    mapping (uint => string []) history;
    item[] public items;

    function getLengthInt (uint [] memory arr) public pure returns (uint) {
        return arr.length;
    }

    function getLengthItems () public view returns (uint) {
        return items.length;
    }

    function _getOwnerToName () public view returns (string memory,string memory) {
        return (OwnerToName[msg.sender],OwnerToName[myAddress]);
    }

    function _getOwnerItems (address user) public view returns (uint[] memory) {
        return ownerItems[user];
    }

    function getItemById (uint id) internal view returns (item storage)
    {
        return items[id];
    }

    event AddUsernamePrompt(address user);

    event itemAdded(string _name,string user,uint uniqueHash);

    function _removeItemFromAddress(address _from, uint _id) private returns (uint) {
        uint index=0;
        for(uint i=0;i<ownerItems[_from].length;i++) {
            if (ownerItems[_from][i]==_id) {
                index=i;
                break;
            }
        }
        ownerItems[_from][index]=ownerItems[_from][ownerItems[_from].length-1];
        ownerItems[_from].pop();
        return index;
    }

    function _recordTransaction (uint uniqueHash,address _from,address _to,uint flag) private {
        uint year;
        uint month;
        uint day;
        uint hour;
        uint minute;
        uint second;
        (year,month,day,hour,minute,second)=getYearMonthDateMinuteSecond();
        string memory s;
        if(flag==0){
        s="Manufactured on ";
        }
        else {
            s="Ownership transferred on ";
        }
        s=string.concat(s,Strings.toString(year),"-",Strings.toString(month),"-",Strings.toString(day)," ",Strings.toString(hour),":",Strings.toString(minute),":",Strings.toString(second)," GMT ");    
        if (flag==0) {
        s=string.concat(s,"by ",OwnerToName[_from]," (",Strings.toHexString(uint256(uint160(_from)), 20)," )");
        }
        else {
            s=string.concat(s," from ",OwnerToName[_from]," (",Strings.toHexString(uint256(uint160(_from)), 20),") to ",OwnerToName[_to]," (",Strings.toHexString(uint256(uint160(_to)), 20)," )");
        }
        history[uniqueHash].push(s);
    }

    function _transfer_item(address _from, address _to, uint _id) private{
        ownerItems[_to].push(_id);
        itemToOwner[_id]=_to;
        _removeItemFromAddress(_from,_id);
        //Only for testing purpose this code is written here. Once testing is done move the below line to _transfer function.
        uint _hash=uint(keccak256(abi.encodePacked(_id)));
        _recordTransaction(_hash,_from,_to,1);
    }

    function _transfer(address _to, uint _hash) private {
        if(bytes(OwnerToName[msg.sender]).length > 0) {
            uint _id=hashToId[_hash];
            _transfer_item(msg.sender,_to,_id);
            
        }
        else {
            emit AddUsernamePrompt(msg.sender);
        }
    }

    function _addItem (string memory _name, string memory f1,string memory v1,string memory f2,string memory v2,string memory f3,string memory v3,string memory f4,string memory v4,string memory f5,string memory v5) private {
        if(bytes(OwnerToName[msg.sender]).length > 0) {
        uint items_length=getLengthItems();
        item storage newItem=items.push();
        newItem.id=items_length;
        newItem.name=_name;
        newItem.features[f1]=v1;
        newItem.features[f2]=v2;
        newItem.features[f3]=v3;
        newItem.features[f4]=v4;
        newItem.features[f5]=v5;
        newItem.keys.push(f1);
        newItem.keys.push(f2);
        newItem.keys.push(f3);
        newItem.keys.push(f4);
        newItem.keys.push(f5);

        ownerItems[msg.sender].push(items_length);
        itemToOwner[items_length]=msg.sender;
        uint uniqueHash=uint(keccak256(abi.encodePacked(items_length)));
        _recordTransaction(uniqueHash,msg.sender,msg.sender,0);
        
        hashToId[uniqueHash]=items_length;
        emit itemAdded(_name,OwnerToName[msg.sender],uniqueHash);
        }
        else {
           emit AddUsernamePrompt(msg.sender);
        }
    }

    function _getItems(uint [] memory _ids) private view returns (string [] memory , string [][] memory,string [][] memory ,uint[] memory ) {
        uint l=_ids.length;
        string [] memory _names= new string[](l);
        string [][] memory keys= new string [][] (l);
        string [][] memory values= new string [][] (l);
        uint[] memory _hashValues= new uint [] (l);
        for(uint i=0;i<l;i++) {
            string memory _name;
            uint u=_ids[i];
            string [] memory key=new string [] (5);
            string [] memory value=new string [] (5);
            keys[i]= new string [] (5);
            values[i]=new string [] (5);
            uint _hashValue;
            _name=items[u].name;
            key[0]=items[u].keys[0];
            key[1]=items[u].keys[1];
            key[2]=items[u].keys[2];
            key[3]=items[u].keys[3];
            key[4]=items[u].keys[4];


            value[0]=items[u].features[items[u].keys[0]];
            value[1]=items[u].features[items[u].keys[1]];
            value[2]=items[u].features[items[u].keys[2]];
            value[3]=items[u].features[items[u].keys[3]];
            value[4]=items[u].features[items[u].keys[4]];
            _hashValue=items[u].id;
            _names[i]=_name;
            keys[i]=key;
            values[i]=value;
            _hashValues[i]=_hashValue;

        }
        return (_names,keys,values,_hashValues);
    }

    function _listAllUserItems(address _userAddress) private returns (string [] memory names, string [][] memory feature_keys,string [][] memory feature_values,uint [] memory ids) {
        if(bytes(OwnerToName[_userAddress]).length > 0) {
            return _getItems(ownerItems[_userAddress]);
        }
        else {
           emit AddUsernamePrompt(_userAddress);
        }
    }

    function _getItemFromHash(uint _hashValue) private view returns (item storage) {
        uint _id=hashToId[_hashValue];
        return items[_id];
    }

    function _addUser(address userAddress, string memory userName) internal{
        
        OwnerToName[userAddress]=userName;
    }

    function _testHistory () public view returns (string [] memory,string [] memory,string [] memory) {
        uint m=0;
        uint mhash=uint(keccak256(abi.encodePacked(m)));
        uint mhash1=uint(keccak256(abi.encodePacked(m+1)));
        uint mhash2=uint(keccak256(abi.encodePacked(m+2)));
        return (history[mhash],history[mhash1],history[mhash2]);

    }

    function _testGetTime () public view returns (uint) {
        return block.timestamp;
    }
 
    function getYearMonthDateMinuteSecond () public view returns (uint,uint,uint,uint,uint,uint) {
        uint t=_testGetTime();
        return DateTime.timestampToDateTime(t);
    }

    
    function _testAddItem () public {
        _addItem("watch","cost","400","color","red","type","digital","","","","");
        _addItem("shirt","cost","700","color","blue","type","cotton","","","","");
        _addItem("bag","cost","1200","color","green","type","polyester","","","","");

    }
    function _testAddUser() public {
        _addUser(msg.sender,"user1");
        
        _addUser(myAddress,"Sampath");
    }

    function _testgetOwnerItems() public view returns (uint [] memory,uint [] memory) {
        return (_getOwnerItems (msg.sender),_getOwnerItems (myAddress));
    }
    function _testListItems() public view returns (string [] memory , string [][] memory,string [][] memory,uint [] memory ) {
        return _getItems(ownerItems[msg.sender]);
    }

    function _testListItemsByUser () public view returns (string [] memory , string [][] memory,string [][] memory,uint [] memory) {
        return _getItems(ownerItems[myAddress]);
    }

    function _testTransferItem() public {
        _transfer_item(msg.sender,myAddress,2);
        _transfer_item(msg.sender,myAddress,1);
        _transfer_item(msg.sender,myAddress,0);
    }
}