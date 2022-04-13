const { inputToConfig } = require("@ethereum-waffle/compiler")
const {expect} = require("chai")
const { ethers } = require("hardhat")

describe("Token Deployment", ()=>{

  let Token
  let vaxxedShibaToken
  let owner
  let addr1
  let addr2
  let addrs

  beforeEach(async()=>{
    Token = await ethers.getContractFactory("Token");
    [owner,addr1,addr2,...addrs] = await ethers.getSigners();
    vaxxedShibaToken = await Token.deploy();
  })

  describe("Deploy",()=>{
    it("Should deploy contract to owner's address",async()=>{
      expect(await vaxxedShibaToken.owner()).to.equal(owner.address)
    })
    it("Should assign total supply of tokens to owner",async()=>{
      expect(await vaxxedShibaToken.totalSupply()).to.equal(await vaxxedShibaToken.balanceOf(owner.address))
    })
  })

  describe("Transaction",()=>{
    it("Should transfer tokens between accounts",async()=>{
      await vaxxedShibaToken.transfer(addr1.address,100)
      expect(await vaxxedShibaToken.balanceOf(addr1.address)).to.equal(100)
      await vaxxedShibaToken.connect(addr1).transfer(addr2.address,50)
      expect(await vaxxedShibaToken.balanceOf(addr2.address)).to.equal(50)
    })
    it("should fail if sender doesn't have enough tokens",async()=>{
      const initialTokenBalance = await vaxxedShibaToken.balanceOf(owner.address)
      await expect(vaxxedShibaToken.connect(addr1).transfer(owner.address,1)).to.be.revertedWith("Not enough tokens")
      expect(await vaxxedShibaToken.balanceOf(owner.address)).to.equal(initialTokenBalance)
    })
    it("should update balances after transfers",async()=>{
      const initialBalanceOwner = await vaxxedShibaToken.balanceOf(owner.address)
      const initialBalanceAddr1 = await vaxxedShibaToken.balanceOf(addr1.address)
      const initialBalanceAddr2 = await vaxxedShibaToken.balanceOf(addr2.address)
      await vaxxedShibaToken.transfer(addr1.address,500)
      await vaxxedShibaToken.transfer(addr2.address,200)
      expect(await vaxxedShibaToken.balanceOf(owner.address)).to.equal(initialBalanceOwner-700)
      expect(await vaxxedShibaToken.balanceOf(addr1.address)).to.equal(initialBalanceAddr1+500)
      expect(await vaxxedShibaToken.balanceOf(addr2.address)).to.equal(initialBalanceAddr2+200)

    })
  })
})
