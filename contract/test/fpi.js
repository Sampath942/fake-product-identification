const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");



  describe ("fpi", () => {
    beforeEach (async () => {
        const Fpi=await ethers.getContractFactory("fpi");
        fpi=await Fpi.deploy();
        [acc1,acc2,acc3]= await ethers.getSigners();
       
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
        it ('Add username prompt emitted for add item', async () => {
            transaction = await fpi._addItem(acc1.address,"bag",["color","","Max weight","",""],["red","","5","",""]);
            await transaction.wait();
            expect(transaction).to.emit(fpi, "AddUsernamePrompt");
        })
        it('Add username prompt emitted for list items', async () => {
            transaction = await fpi._listAllUserItems(acc1.address);
            const reciept = await transaction.wait();
            expect(transaction).to.emit(fpi, "AddUsernamePrompt");
        })
        it ('Add username prompt for transfering to unregistered user',async () => {
            await fpi._addUser(acc1.address,"sampath");
            transaction = await fpi._addItem(acc1.address,"bag",["color","","Max weight","",""],["red","","5","",""]);
            const hashValue = await fpi._getHashFromId(0);
            newTransaction=await fpi._transfer(acc2.address,hashValue);
            expect(newTransaction).to.emit(fpi, "AddUsernamePrompt");
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
    })

    describe ("Listing item", async () => {
        beforeEach(async () => {
            await fpi._addUser(acc1.address,"sampath");
            await fpi._addUser(acc2.address,"kumar");
            await fpi._addUser(acc3.address,"sam");
            await fpi._addItem(acc1.address,"bag",["color","","Max weight","",""],["red","","5","",""]);
            await fpi._addItem(acc1.address,"bag",["color","","Max weight","",""],["red","","5","",""]);

        })
        it('Return an empty array of items for a user with no products owned', async () => {
           
            transaction = await fpi._listAllUserItems(acc1.address);
            const arr = await transaction.wait();
            console.log(transaction);
            console.log(arr);

        })

    })
   
})

