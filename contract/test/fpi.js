const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");


const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe ("fpi", () => {

    beforeEach (async () => {
        [acc1,acc2,acc3]= await ethers.getSigners();
        const Fpi=await ethers.getContractFactory("fpi");
        fpi=await Fpi.deploy();
    })

    it('Intially items array is empty', async () => {
        
        expect (await fpi.getLengthItems()).to.equal(0);
        
    })

    describe ("AddItem", () => {
        beforeEach(async () => {
            transaction = await fpi._addItem("bag","color","red","Max weight","5","","","","","","");
            await transaction.wait();
        })

        it ('Add username prompt emitted', async () => {
            expect(transaction).to.emit(fpi, "AddUsernamePrompt");
        })
    })
    
})