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
            transaction = await fpi._addItem(acc1.address,"bag","color","red","Max weight","5","","","","","","");
            await transaction.wait();
            expect(transaction).to.emit(fpi, "AddUsernamePrompt");
        })
        it('Add username prompt emitted for list items', async () => {
            transaction = await fpi._listAllUserItems(acc1.address);
            await transaction.wait();
            expect(transaction).to.emit(fpi, "AddUsernamePrompt");
        })
        it ('Add username prompt for transfering to unregistered user',async () => {
            await fpi._addUser(acc1.address,"sampath");
            transaction = await fpi._addItem(acc1.address,"bag","color","red","Max weight","5","","","","","","");
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
            it('Add an item for each user', async () => {
                await fpi._addItem(acc1.address,"bag","color","red","Max weight","5","","","","","","");
                await fpi. _addItem(acc2.address,"shirt","cost","700","color","blue","type","cotton","","","","");
                await fpi._addItem(acc3.address,"watch","cost","400","color","red","type","digital","","","","");
                items_length = await fpi.getLengthItems();
                expect(items_length).to.equal(3);
            })
    })
    
})