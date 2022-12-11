const { network } = require('hardhat');
const { networkConfiguration } = require('../helperHardhat.config');
const { verifyContract } = require('../utils/verifyContract');

const developmentChains = ['hardhat', 'localhost'];

module.exports = async (hre) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const { chainId } = network.config;
  const currentNetwork = network.name;

  let ethUsdPriceFeedAddress;

  if (developmentChains.includes(currentNetwork)) {
    const ethUsdPriceFeedContract = await get('MockV3Aggregator');
    ethUsdPriceFeedAddress = ethUsdPriceFeedContract.address;
  } else {
    ethUsdPriceFeedAddress =
      networkConfiguration[chainId].ethUsdPriceFeedAddress;
  }

  const contract = await deploy('FundMe', {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log('FundMe contract deployed...');
  log('-----------------------------------');

  if (
    !developmentChains.includes(currentNetwork) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verifyContract(contract.address, [ethUsdPriceFeedAddress]);
  }
};

module.exports.tags = ['all', 'fundMe'];
