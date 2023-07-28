const ManagersTBA = artifacts.require('ManagersTBA');
const MyToken = artifacts.require('MyToken');
const { expect } = require('chai');
const NFT_ADDRESS = "0xcff22eBa284D0A1827773B4617aC3FDBCf027963"


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

    it("Withdraw previously sent VET", async function () {
      var result = await this.nft.withdraw();
      expect(true);
    });

  });

});