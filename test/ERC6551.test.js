const ManagersTBA = artifacts.require('ManagersTBA');
const MyToken = artifacts.require('MyToken');
const { expect } = require('chai');
const NFT_ADDRESS = "0x814DB7e571DE4A5F38B1d596051A96bE5302bDEc"


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
        var mintResult = await this.nft.mint(mintedSoFar + 1, FIRST_OWNER, {value: 1000000000000000000});
        
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
});