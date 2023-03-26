const {
    time,
    
  } = require("@nomicfoundation/hardhat-network-helpers");
  
  require( "@nomicfoundation/hardhat-chai-matchers");
  const { expect } = require("chai");



  describe ("fpi", () => {
    beforeEach (async () => {
        const Fpi=await ethers.getContractFactory("fpi");
        fpi=await Fpi.deploy();
        [acc1,acc2,acc3,acc4]= await ethers.getSigners();
       
    })
    describe ("general", () => {
        it('Intially items array is empty', async () => {        
            expect (await fpi.getLengthItems()).to.equal(0);            
        })
        it('Add a user', async () => {
            await fpi._addUser(acc1.address,"sampath");
            const result = await fpi._getOwnerToName(acc1.address);
            expect (result).to.equal("sampath");
        })    
    })
   
    describe ("User not existing ", () => {
        it ('Transaction reverted for adding item without having a username', async () => {
            await expect(fpi._addItem(acc1.address,"bag",["color","","Max weight","",""],["red","","5","",""])).to.be.reverted;
        })
        it('Transaction reverted for listing out items without having a username', async () => {
            await expect(fpi._listAllUserItems(acc1.address)).to.be.reverted;
        })
        it('Transaction reverted for transfering items without having a username', async () => {
            const hashValue = await fpi._getHashFromId(0);
            await expect(fpi._transfer(acc4.address,acc1.address,hashValue)).to.be.reverted;
        })
        it ('Add username prompt for transfering to unregistered user',async () => {
            await fpi._addUser(acc1.address,"sampath");
            transaction = await fpi._addItem(acc1.address,"bag",["color","","Max weight","",""],["red","","5","",""]);
            const hashValue = await fpi._getHashFromId(0);
            newTransaction=await fpi._transfer(acc1.address,acc2.address,hashValue);
            expect(newTransaction).to.emit(fpi, "UserDoesntExist");
        })
    })

    describe ("Adding item", () => {
        beforeEach(async () => {
            await fpi._addUser(acc1.address,"sampath");
            await fpi._addUser(acc2.address,"kumar");
            await fpi._addUser(acc3.address,"sam");
        })
            it('Check for username', async () => {
                user_1=await fpi.OwnerToName(acc1.address);
                user_2=await fpi.OwnerToName(acc2.address);
                user_3=await fpi.OwnerToName(acc3.address);
                expect(user_1).to.equal('sampath');
                expect(user_2).to.equal('kumar');
                expect(user_3).to.equal('sam');
            })
            it('Add an item for each user', async () => {
                await fpi._addItem(acc1.address,"bag",["color","","Max weight","",""],["red","","5","",""]);
                items_length = await fpi.getLengthItems();
                expect(items_length).to.equal(1);
                await fpi. _addItem(acc2.address,"shirt",["cost","","color","","type"],["700","","blue","","cotton"]);
                items_length = await fpi.getLengthItems();
                expect(items_length).to.equal(2);
                await fpi._addItem(acc3.address,"watch",["cost","","color","","type"],["400","","red","","digital"]);
                items_length = await fpi.getLengthItems();
                //await fpi.ownerItems(acc1.address)
                expect(items_length).to.equal(3);
                
               


            })
            it('Check ownership is assigned correctly while adding', async () => {
                await fpi._addItem(acc1.address,"bag",["color","","Max weight","",""],["red","","5","",""]);
                await fpi. _addItem(acc2.address,"shirt",["cost","","color","","type"],["700","","blue","","cotton"]);
                await fpi._addItem(acc3.address,"watch",["cost","","color","","type"],["400","","red","","digital"]);
                owner_1=await fpi.itemToOwner(0);
                owner_2=await fpi.itemToOwner(1);
                owner_3=await fpi.itemToOwner(2);
                expect (owner_1).to.equal(acc1.address);
                expect (owner_2).to.equal(acc2.address);
                expect (owner_3).to.equal(acc3.address);
            })
            it ('Add item with name bag and id 0', async () => {
                await fpi._addItem(acc1.address,"bag",["color","","Max weight","",""],["red","","5","",""]);
                my_item=await fpi.items(0);
                expect(my_item.name).to.equal("bag");
                expect(my_item.id).to.equal(0);

            })
            
            it('History of item updated', async() => {
                await fpi._addItem(acc1.address,"bag",["color","","Max weight","",""],["red","","5","",""]);
                hist=await fpi.getHistory(0);
               // console.log(hist);

            })
    })

    describe ("Listing item", async () => {
        beforeEach(async () => {
            await fpi._addUser(acc1.address,"sampath");
            await fpi._addUser(acc2.address,"kumar");
            await fpi._addUser(acc3.address,"sam");
            await fpi._addItem(acc1.address,"bag",[ 'color', '', 'Max weight', '', '' ],["red","","5","",""]);
            hash0=await fpi._getHashFromId(0);
            hash1=await fpi._getHashFromId(1);
        })
        it('Return item details of a bag', async () => {
           
            transaction = await fpi._listAllUserItems(acc1.address);
            names = ["bag"];
            feature_keys = [[ 'color', '', 'Max weight', '', '' ]];
            feature_values = [["red","","5","",""]];
            ids=[hash0];
            expect (transaction.ids[0]).to.equal(ids[0]);
            expect (transaction.names[0]).to.equal(names[0]);
            for(x=0;x<5;x++)
            {
                expect (transaction.feature_keys[0][x]).to.equal(feature_keys[0][x]);
                expect (transaction.feature_values[0][x]).to.equal(feature_values[0][x]);
            }
            
        })

        it('Return empty array of item details', async () => {
            transaction = await fpi._listAllUserItems(acc2.address);
            expect (transaction.ids.length).to.equal(0);
            expect (transaction.names.length).to.equal(0);
            expect (transaction.feature_keys.length).to.equal(0);
            expect (transaction.feature_values.length).to.equal(0);
            
        })

        it('Return item details of a bag and a shirt', async () => {
           
            await fpi._addItem(acc1.address,"shirt",[ 'color', 'brand', 'Cost', '', '' ],["black","calvin clein","5000","",""]);
            transaction = await fpi._listAllUserItems(acc1.address);
            names = ["bag","shirt"];
            feature_keys = [[ 'color', '', 'Max weight', '', '' ],['color', 'brand', 'Cost', '', '']];
            feature_values = [["red","","5","",""],["black","calvin clein","5000","",""]];
            ids=[hash0,hash1];
            for(y=0;y<2;y++)
            {
                expect (transaction.ids[y]).to.equal(ids[y]);
                expect (transaction.names[y]).to.equal(names[y]);
                for(x=0;x<5;x++)
                {
                    expect (transaction.feature_keys[y][x]).to.equal(feature_keys[y][x]);
                    expect (transaction.feature_values[y][x]).to.equal(feature_values[y][x]);
                }
            }
            
        })

    })

    describe ("Transferring ownership of items", async () => {
        beforeEach (async () => {
            await fpi._addUser(acc1.address,"sampath");
            await fpi._addUser(acc2.address,"kumar");
            await fpi._addUser(acc3.address,"sam");
            await fpi._addItem(acc1.address,"bag",[ 'color', '', 'Max weight', '', '' ],["red","","5","",""]);
            await fpi._addItem(acc1.address,"shirt",[ 'color', 'brand', 'Cost', '', '' ],["black","calvin clein","5000","",""]);
            await fpi._addItem(acc3.address,"watch",["cost","","color","","type"],["400","","red","","digital"]);
            hash0=await fpi._getHashFromId(0);
            hash1=await fpi._getHashFromId(1);

        })

        it('Transfer ownership of bag from user sampath to user kumar', async () => {
            id = await fpi._getHashFromId(0);
            await fpi._transfer(acc1.address,acc2.address,id);
            transaction = await fpi._listAllUserItems(acc2.address);
            names = ["bag"];
            feature_keys = [[ 'color', '', 'Max weight', '', '' ]];
            feature_values = [["red","","5","",""]];
            ids=[hash0];
            expect (transaction.ids[0]).to.equal(ids[0]);
            expect (transaction.names[0]).to.equal(names[0]);
            for(x=0;x<5;x++)
            {
                expect (transaction.feature_keys[0][x]).to.equal(feature_keys[0][x]);
                expect (transaction.feature_values[0][x]).to.equal(feature_values[0][x]);
            }
        })

        it('Check item assignment after transfer', async () => {
            id = await fpi._getHashFromId(0);
            await fpi._transfer(acc1.address,acc2.address,id);
            transaction = await fpi._listAllUserItems(acc2.address);
            names = ["bag"];
            feature_keys = [[ 'color', '', 'Max weight', '', '' ]];
            feature_values = [["red","","5","",""]];
            ids=[hash0];
            owner_2=await fpi.itemToOwner(0);
            expect (owner_2).to.equal(acc2.address);
            expect (transaction.ids[0]).to.equal(ids[0]);
            expect (transaction.names[0]).to.equal(names[0]);
            for(x=0;x<5;x++)
            {
                expect (transaction.feature_keys[0][x]).to.equal(feature_keys[0][x]);
                expect (transaction.feature_values[0][x]).to.equal(feature_values[0][x]);
            }

        })

    })

    
   
})