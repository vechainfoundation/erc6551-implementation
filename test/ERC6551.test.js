const ManagersTBA = artifacts.require('ManagersTBA');
const SimpleERC6551Account = artifacts.require("SimpleERC6551Account");
const MyToken = artifacts.require('MyToken');
const { expect } = require('chai');
const NFT_ADDRESS = "0x510CfA4a2bF2E9b1De1D1B231C86790A45F9bA33"


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

        var mintedSoFar = (await this.nft.totalSupply()).toNumber();
        var ownerOfLastMintedNFT = await this.nft.showTBA(mintedSoFar);
        const VTHO = await new MyToken("0x0000000000000000000000000000456E65726779");
        var accountBalance = await VTHO.balanceOf(ownerOfLastMintedNFT);
        console.log("Before NFT VTHO Balance: ", accountBalance.toString());
        console.log("Sending VTHO to Account");
        await VTHO.transfer(ownerOfLastMintedNFT, 1000000000000000, {from: FIRST_OWNER})
        var accountBalance = await VTHO.balanceOf(ownerOfLastMintedNFT);
        console.log("After NFT VTHO Balance: ", accountBalance.toString());

        const myTokenABI = VTHO.abi;

        const functionSignature = 'transfer(address,uint256)';
        const addressToSendTo = '0xb1690c08e213a35ed9bab7b318de14420fb57d8c';
        const amountToSend = ethers.utils.parseUnits("1", 1);

        var encodedFunctionCall = ethers.utils.defaultAbiCoder.encode(
          ['string', 'address', 'uint256'],
          [functionSignature, addressToSendTo, amountToSend]
        );
        
        const contractInterface = new ethers.utils.Interface(myTokenABI);
        var encodedFunctionCall = contractInterface.encodeFunctionData(functionSignature, [addressToSendTo, amountToSend]);

        // console.log(encodedFunctionCall);


        // Run executeCall to send VET out of Token bound account
        var mintedSoFar = (await this.nft.totalSupply()).toNumber();
        var ownerOfLastMintedNFT = await this.nft.showTBA(mintedSoFar);

        // console.log("Owner of last minted NFT: ", ownerOfLastMintedNFT);
        var accountContract = await new SimpleERC6551Account(ownerOfLastMintedNFT);
        var tx = await accountContract.executeCall("0x0000000000000000000000000000456E65726779", 0, encodedFunctionCall, {from: NEW_OWNER});

        expect(tx);
    });

    it("Withdraw previously sent VET from NFT", async function () {
      var result = await this.nft.withdraw(); // withdraws all balance
      expect(result);
    });

    it("Send/Receive VET to/from account", async function() {

      var mintedSoFar = (await this.nft.totalSupply()).toNumber();
      var ownerOfLastMintedNFT = await this.nft.showTBA(mintedSoFar);

      console.log("Owner of last minted NFT: ", ownerOfLastMintedNFT);
      var accountContract = await new SimpleERC6551Account(ownerOfLastMintedNFT);
      console.log(accountContract.address);

      // fund account first with 100 VET
      var tx1 = await accountContract.initialize({value: 100000000000000000000});

      // Run executeCall to send VET out of Token bound account
      var tx2 = await accountContract.executeCall("0x25Df024637d4e56c1aE9563987Bf3e92C9f534c0", 1, [], {from: NEW_OWNER});

      expect(true)
    });

  });

});