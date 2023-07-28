const ManagersTBA = artifacts.require('ManagersTBA');
const MyToken = artifacts.require('MyToken');
const { expect } = require('chai');
const ADDRESS = "0x6579A6F2c20f0FA2e011d19093f7665b41979446"

contract('ManagersTBA', function (accounts) {
  beforeEach(async function () {
    this.ManagersTBA = await new ManagersTBA(ADDRESS);
  });

  it('Address is correct', async function () {
      var nft = await this.ManagersTBA;
      expect(nft.address).to.equal(ADDRESS);
    });

    it('Mint to random address', async function () {
        var nft = await this.ManagersTBA;
        var mintResult = await nft.mint(1, "0x1D94FAA58597C0417207681a512Df24Bb7702acb", {value: 1000000000000000000});

        expect(mintResult);
    });

    it("Newly minted NFT's owner is correct", async function(){
      var ownerAddress = await nft.ownerOf(1);
      expect(ownerAddress).to.equal("0x1D94FAA58597C0417207681a512Df24Bb7702acb");
    });

});