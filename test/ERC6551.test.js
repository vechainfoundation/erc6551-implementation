const ManagersTBA = artifacts.require('ManagersTBA');
const { expect } = require('chai');
const ADDRESS = "0xD06c09a1D2Df8948D94588E6BFcefb22d4f30264"

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

});