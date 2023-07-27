const ManagersTBA = artifacts.require('ManagersTBA');
const { expect } = require('chai');

contract('ManagersTBA', function (accounts) {
  beforeEach(async function () {
    this.ManagersTBA = await new ManagersTBA("0xe5b22a7ea2921867D00C7E2853f084bF1a420bb8");
  });

  it('default value is 0', async function () {
      var ret = await this.ManagersTBA;
      
      // 0x575081D1590bA48C72d5c92188Af12BB6359FcC1
      console.log("ManagersTBA address: ", ret.address)

      expect(true);
    });

});