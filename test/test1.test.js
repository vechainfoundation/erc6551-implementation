const ManagersTBA = artifacts.require('ManagersTBA');
const { expect } = require('chai');
const ADDRESS = "0xe5b22a7ea2921867D00C7E2853f084bF1a420bb8"

contract('ManagersTBA', function (accounts) {
  beforeEach(async function () {
    
    this.ManagersTBA = await new ManagersTBA(ADDRESS);
  });

  it('Address is correct', async function () {
      var ret = await this.ManagersTBA;
      expect(ret.address).to.equal(ADDRESS);
    });

});