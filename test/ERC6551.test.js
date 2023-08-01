const ManagersTBA = artifacts.require('ManagersTBA');
const SimpleERC6551Account = artifacts.require("SimpleERC6551Account");
const MyToken = artifacts.require('MyToken');
const { expect } = require('chai');


function getCallDataForVTHOTransfer(VTHO, SOME_RECIPIENT_OF_VTHO) {
  const myTokenABI = VTHO.abi;
  const functionSignature = 'transfer(address,uint256)';
  const addressToSendTo = SOME_RECIPIENT_OF_VTHO;
  const amountToSend = ethers.utils.parseUnits("1", 1);

  var encodedFunctionCall = ethers.utils.defaultAbiCoder.encode(
    ['string', 'address', 'uint256'],
    [functionSignature, addressToSendTo, amountToSend]
  );
  
  const contractInterface = new ethers.utils.Interface(myTokenABI);
  var encodedFunctionCall = contractInterface.encodeFunctionData(functionSignature, [addressToSendTo, amountToSend]);
  return encodedFunctionCall;
}


contract('ManagersTBA', function (accounts) {
  const MANAGER_TBA_CONTRACT_ADDRESS = "0xA2acd0ab418C633408579304C2AD4266B0aC8D7F"
  const ORIGINAL_OWNER_ADDRESS = accounts[0]
  const NEW_OWNER_ADDRESS = accounts[1]
  const VTHO_CONTRACT_ADDRESS = "0x0000000000000000000000000000456E65726779";
  const ONE_HUNDRED_VET = 100000000000000000000;
  const SOME_RECIPIENT_OF_VET = "0x25Df024637d4e56c1aE9563987Bf3e92C9f534c0";
  const SOME_RECIPIENT_OF_VTHO = "0xb1690c08e213a35ed9bab7b318de14420fb57d8c";

  beforeEach(async function () {
    this.nft = await new ManagersTBA(MANAGER_TBA_CONTRACT_ADDRESS);
  });

  it('Address is correct', async function () {
      expect(this.nft.address).to.equal(MANAGER_TBA_CONTRACT_ADDRESS);
    });

    describe("Minting", async function(){

      it('Mint to random address', async function () {
        var mintedSoFar = (await this.nft.totalSupply()).toNumber();
        var mintResult = await this.nft.mint(mintedSoFar + 1, ORIGINAL_OWNER_ADDRESS, {value: ONE_HUNDRED_VET});

        expect(mintResult);
      });

      it("Newly minted NFT's owner is correct", async function(){
        var mintedSoFar = (await this.nft.totalSupply()).toNumber();
        var ownerAddress = await this.nft.ownerOf(mintedSoFar);

        expect(ownerAddress).to.equal(ORIGINAL_OWNER_ADDRESS);
      });

      it("Transfer NFT to new ownwer", async function(){
        var mintedSoFar = (await this.nft.totalSupply()).toNumber();
        var transferResult = await this.nft.transferFrom(ORIGINAL_OWNER_ADDRESS, NEW_OWNER_ADDRESS, mintedSoFar)      

        expect(transferResult);
      });

      it("NFT has been sent to new owner", async function(){
        var mintedSoFar = (await this.nft.totalSupply()).toNumber();
        var ownerAddress = await this.nft.ownerOf(mintedSoFar);
        expect(ownerAddress).to.equal(NEW_OWNER_ADDRESS);
      });

    });

    describe("Token Transfers", async function(){

      it('Send/Receive ERC20', async function () {

        // Get token bound account of last minted NFT
        var mintedSoFar = (await this.nft.totalSupply()).toNumber();
        var ownerOfLastMintedNFT = await this.nft.showTBA(mintedSoFar);
        
        // Transfer VTHO to this account
        const VTHO = await new MyToken(VTHO_CONTRACT_ADDRESS);
        await VTHO.transfer(ownerOfLastMintedNFT, 100000000000, {from: ORIGINAL_OWNER_ADDRESS})

        // Construct calldata for executeCall on token bound account
        var encodedFunctionCall = getCallDataForVTHOTransfer(VTHO, SOME_RECIPIENT_OF_VTHO);
        
        // Call the executeCall method on the token bound account
        var accountContract = await new SimpleERC6551Account(ownerOfLastMintedNFT);
        var tx = await accountContract.executeCall(VTHO_CONTRACT_ADDRESS, 0, encodedFunctionCall, {from: NEW_OWNER_ADDRESS});

        expect(tx);
    });

    it("Withdraw previously sent VET from NFT", async function () {
      var result = await this.nft.withdraw(); // withdraws all balance
      expect(result);
    });

    it("Send/Receive VET to/from account", async function() {

      // Get token bound account of last minted NFT
      var mintedSoFar = (await this.nft.totalSupply()).toNumber();
      var ownerOfLastMintedNFT = await this.nft.showTBA(mintedSoFar);

      var accountContract = await new SimpleERC6551Account(ownerOfLastMintedNFT);

      // Fund account with 100 VET
      var tx1 = await accountContract.initialize({value: ONE_HUNDRED_VET});

      // Run executeCall to send VET out of Token bound account
      var tx2 = await accountContract.executeCall(SOME_RECIPIENT_OF_VET, 1, [], {from: NEW_OWNER_ADDRESS});

      expect(true)
    });

  });

});