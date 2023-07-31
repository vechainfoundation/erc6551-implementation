const ManagersTBA = artifacts.require('ManagersTBA');
const SimpleERC6551Account = artifacts.require("SimpleERC6551Account");
const MyToken = artifacts.require('MyToken');
const { expect } = require('chai');
const NFT_ADDRESS = "0x6979fDd625A54341e111A2Fc81deC4e73da5d690"


contract('ManagersTBA', function (accounts) {
  const FIRST_OWNER = accounts[0]
  const NEW_OWNER = accounts[1]

  beforeEach(async function () {
    this.nft = await new ManagersTBA(NFT_ADDRESS);
  });

  it('Address is correct', async function () {
      expect(this.nft.address).to.equal(NFT_ADDRESS);
    });

    describe("Minting", async function(){

      it('Mint to random address', async function () {
        var mintedSoFar = (await this.nft.totalSupply()).toNumber();
        var mintResult = await this.nft.mint(mintedSoFar + 1, FIRST_OWNER, {value: 10000000000000000000});
        
        console.log("Owner of minted NFT: ", await this.nft.showTBA(mintedSoFar));

        expect(mintResult);
      });

      it("Newly minted NFT's owner is correct", async function(){
        var mintedSoFar = (await this.nft.totalSupply()).toNumber();
        var ownerAddress = await this.nft.ownerOf(mintedSoFar);

        expect(ownerAddress).to.equal(FIRST_OWNER);
      });

      it("Transfer NFT to new ownwer", async function(){
        var mintedSoFar = (await this.nft.totalSupply()).toNumber();
        var transferResult = await this.nft.transferFrom(FIRST_OWNER, NEW_OWNER, mintedSoFar)      

        expect(transferResult);
      });

      it("NFT has been sent to new owner", async function(){
        var mintedSoFar = (await this.nft.totalSupply()).toNumber();
        var ownerAddress = await this.nft.ownerOf(mintedSoFar);
        expect(ownerAddress).to.equal(NEW_OWNER);
      });

    });

    describe("Token Transfers", async function(){

      it('Send ERC20', async function () {

        const VTHO = await new MyToken("0x0000000000000000000000000000456E65726779");
        var nftBalance = await VTHO.balanceOf(this.nft.address);
        console.log("Before NFT VTHO Balance: ", nftBalance.toString());
        console.log("Sending VTHO to NFT");
        await VTHO.transfer(this.nft.address, 1000000000000000)
        var nftBalance = await VTHO.balanceOf(this.nft.address);
        console.log("After NFT VTHO Balance: ", nftBalance.toString());

        expect(true);
    });

    it("Receive ERC20", async function() {

      console.log("Owner: ", await this.nft.owner());

      // var accountAddress = await this.nft.

      // console.log("Account of NFT: ", accountAddress);

      // var simpleERC6551Account = new SimpleERC6551Account(accountAddress);
      // console.log(simpleERC6551Account)

      expect(1)
    });

    it("Withdraw previously sent VET", async function () {
      var result = await this.nft.withdraw(); // withdraws all balance
      expect(result);
    });

  });

});