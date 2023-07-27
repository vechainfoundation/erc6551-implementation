const { network } = require("hardhat");
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const waitBlockConfirmations = developmentChains.includes(network.name) ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS;

    log("----------------------------------------------------");

    // Deploy ERC6551Registry
    const ERC6551Registry = artifacts.require("ERC6551Registry");
    const ERC6551registry = await ERC6551Registry.new();

    // Deploy ERC6551AccountImplementation
    const SimpleERC6551Account = artifacts.require("SimpleERC6551Account");
    const SimpleERC6551account = await SimpleERC6551Account.new();

    log("ERC6551Registry: ", ERC6551registry.address);
    log("SimpleERC6551Account: ", SimpleERC6551account.address);

    // Deployed address, currently all the same for all chains https://docs.tokenbound.org/contracts/deployments
    const arguments = [ERC6551registry.address, SimpleERC6551account.address];
    const nft = await deploy("ManagersTBA", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    });

    log("NFT address " + nft.address);

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...");
        await verify(nft.address, arguments);
    }
};

module.exports.tags = ["all", "nft"];
