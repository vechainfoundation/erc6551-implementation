const { network } = require("hardhat");
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const waitBlockConfirmations = developmentChains.includes(network.name) ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS;

    log("----------------------------------------------------");

    // Deploy ERC6551Registry
    const ERC6551Registry = await ethers.getContractFactory("ERC6551Registry");
    const ERC6551registry = await ERC6551Registry.deploy();

    // Deploy ERC6551AccountImplementation
    const SimpleERC6551Account = await ethers.getContractFactory("SimpleERC6551Account");
    const SimpleERC6551account = await SimpleERC6551Account.deploy();

    log("ERC6551Registry: ", ERC6551registry.address);
    log("SimpleERC6551Account: ", SimpleERC6551account.address);

    // Deployed address, currently all the same for all chains https://docs.tokenbound.org/contracts/deployments
    const arguments = ["0x02101dfB77FDE026414827Fdc604ddAF224F0921", "0x2d25602551487c3f3354dd80d76d54383a243358"];
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
