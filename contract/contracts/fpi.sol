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
    //Just a dummy hardhat address
    address constant public myAddress = 0xE0f5206BBD039e7b0592d8918820024e2a7437b9;
    mapping (address => uint[]) private ownerItems;
    mapping (address => string) public OwnerToName;
    mapping (uint => address) public itemToOwner;
    mapping (uint => uint) private hashToId;
    mapping (uint => string []) private history;
    item[] public items;



    function getLengthItems () public view returns (uint) {
        return items.length;
    }

    function _getOwnerToName (address _userAddress) public view returns (string memory) {
        return (OwnerToName[_userAddress]);
    }
 

 // _getOwnerItems is just a helper function used in test function to visualize the items......Once frontend work is complete this can be removed
    function _getOwnerItems (address user) public view returns (uint[] memory) {
        return ownerItems[user];
    }

   


    event itemAdded(string _name,string user,uint uniqueHash);

    event UserDoesntExist(address user);

    event TransactionRecorded(string [] s,string ass);

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


    function _transfer_item(address _from, address _to, uint _hash) private{
        uint _id=hashToId[_hash];
        ownerItems[_to].push(_id);
        itemToOwner[_id]=_to;
        _removeItemFromAddress(_from,_id);
        _recordTransaction(_hash,_from,_to,1);
    }

    function _transfer(address _from,address _to, uint _hash) public {
        assert(bytes(_getOwnerToName(_from)).length > 0);
        if(bytes(_getOwnerToName(_to)).length > 0) {
            _transfer_item(_from,_to,_hash);
        }
        else {
            emit UserDoesntExist(_to);
        }
    }

    function emitItemAdded(string memory _name,address _userAddress,uint hash) private {
        emit itemAdded(_name,OwnerToName[_userAddress],hash);
    }

    function _itemAdding(address _userAddress,string memory _name, string [] memory ftrs,string [] memory vals) private {
        
        {
        uint items_length=items.length;
        item storage newItem=items.push();
        newItem.id=items_length;
        newItem.name=_name;
        newItem.features[ftrs[0]]=vals[0];
        newItem.features[ftrs[1]]=vals[1];
        newItem.features[ftrs[2]]=vals[2];
        newItem.features[ftrs[3]]=vals[3];
        newItem.features[ftrs[4]]=vals[4];
        newItem.keys.push(ftrs[0]);
        newItem.keys.push(ftrs[1]);
        newItem.keys.push(ftrs[2]);
        newItem.keys.push(ftrs[3]);
        newItem.keys.push(ftrs[4]);

        ownerItems[_userAddress].push(items_length);
        itemToOwner[items_length]=_userAddress;
        }

        {
         uint items_length=items.length-1;
        _recordTransaction(uint(keccak256(abi.encodePacked(items_length))),_userAddress,_userAddress,0);
        uint uniqueHash=uint(keccak256(abi.encodePacked(items_length)));
        hashToId[uniqueHash]=items_length;
        }
        {
        emit itemAdded(_name,OwnerToName[_userAddress],uint(keccak256(abi.encodePacked(items.length-1))));
        }
    
    }


    function _addItem (address _userAddress,string memory _name, string [] memory ftrs,string [] memory vals) public {
        require(bytes(_getOwnerToName(_userAddress)).length > 0);
        _itemAdding(_userAddress,_name,ftrs,vals);
    }

    function _getItems(uint [] memory _ids) private view returns (string [] memory, string [][] memory,string [][] memory,uint[] memory) {
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
            _hashValue=uint(keccak256(abi.encodePacked(items[u].id)));
            _names[i]=_name;
            keys[i]=key;
            values[i]=value;
            _hashValues[i]=_hashValue;

        }
        return (_names,keys,values,_hashValues);
    }

    function _listAllUserItems(address _userAddress) public view  returns (string [] memory names, string [][] memory feature_keys,string [][] memory feature_values,uint [] memory ids){
        require(bytes(_getOwnerToName(_userAddress)).length > 0);
            (names,feature_keys,feature_values,ids)= _getItems(ownerItems[_userAddress]);
            return (names,feature_keys,feature_values,ids);
    }

    //Do not delete _getItemFromHash function.....even though it is not called from within the contract,
    // we are going to use it in scan QR part of the front end code
    function _getHashToId(uint _hashValue) public view returns (uint) {
        uint _id=hashToId[_hashValue];
        return _id;
    }

    function _getHashFromId(uint _id) public pure returns (uint) {
        uint _hash = uint(keccak256(abi.encodePacked(_id)));
        return _hash;
    }

    function _getItemFromHash(uint _hashValue) private view returns (item storage) {
        uint _id=_getHashToId(_hashValue);
        return items[_id];
    }

    function _userAdding(address userAddress, string memory userName) private {
        OwnerToName[userAddress]=userName;
    }

    function _addUser(address userAddress, string memory userName) public {
        _userAdding(userAddress,userName);
    }

// From here on every function used is just for the sake of testing purposes.....can be deleted once the code is completely checked and functional
    function getHistory (uint m) public view returns (string [] memory) {
        uint mhash=uint(keccak256(abi.encodePacked(m)));
        return history[mhash];
    }
     function _testHistory () public view returns (string [][] memory) {
        uint m=0;
        uint mhash=uint(keccak256(abi.encodePacked(m)));
        string [][] memory temp;
        temp[m]=history[mhash];
        while(history[mhash].length>0){
            m++;
            temp[m]=history[mhash];
            mhash=uint(keccak256(abi.encodePacked(m)));
        }
        

        return temp;

    }

    function _testGetTime () public view returns (uint) {
        return block.timestamp;
    }

    function purelyfortesting() public  {
        uint h=_getHashFromId(0);
        _recordTransaction(h,msg.sender,myAddress,0);
    }

    function getYearMonthDateMinuteSecond () public view returns (uint,uint,uint,uint,uint,uint) {
        uint t=_testGetTime();
        return DateTime.timestampToDateTime(t);
    }


    function _testAddItem () public {
        string [] memory ftrs = new string [] (5);
        string [] memory vals = new string [] (5);
        ftrs[0]="cost";
        ftrs[1]="color";
        ftrs[2]="type";
        ftrs[3]="";
        ftrs[4]="";
        vals[0]="400";
        vals[1]="red";
        vals[2]="digital";
        vals[3]="";
        vals[4]="";
        _addItem(msg.sender,"watch",ftrs,vals);
        ftrs[0]="cost";
        ftrs[1]="color";
        ftrs[2]="type";
        ftrs[3]="";
        ftrs[4]="";
        vals[0]="800";
        vals[1]="white";
        vals[2]="cotton";
        vals[3]="";
        vals[4]="";
        _addItem(msg.sender,"shirt",ftrs,vals);
        ftrs[0]="cost";
        ftrs[1]="color";
        ftrs[2]="type";
        ftrs[3]="";
        ftrs[4]="";
        vals[0]="1200";
        vals[1]="blue";
        vals[2]="polyester";
        vals[3]="";
        vals[4]="";
        _addItem(msg.sender,"bag",ftrs,vals);


    }
    function _testAddUser() public {
        
        _addUser(msg.sender,"user1");

        _addUser(myAddress,"Sampath");
    }

    function _testgetOwnerItems() public view returns (uint [] memory,uint [] memory) {
        
        return (_getOwnerItems (msg.sender),_getOwnerItems (myAddress));
    }
    function _testListItems(address _userAddress) public view {
         _getItems(ownerItems[_userAddress]);
    }

// This way looks cleaner than the previous approach
    function _testListItemsByUser (uint flag) public view {
        if (flag==0) {
            
         _testListItems(myAddress);
        }
             _testListItems(msg.sender);

    }

    function _testTransferItem() public {
        
        int i=0;
        //_transfer_item(msg.sender,myAddress,uint(keccak256(abi.encodePacked(i+2))));
        //_transfer_item(msg.sender,myAddress,uint(keccak256(abi.encodePacked(i+1))));
        _transfer_item(msg.sender,myAddress,uint(keccak256(abi.encodePacked(i))));
    }
}