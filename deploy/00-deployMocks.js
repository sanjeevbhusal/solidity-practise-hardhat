const { network } = require('hardhat');
const {
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
} = require('../helperHardhat.config');

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { log, deploy } = deployments;

  const currentNetwork = network.name;
  if (developmentChains.includes(currentNetwork)) {
    log('Local network detected. Deploying Mocks...');

    await deploy('MockV3Aggregator', {
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    });

    log('Mocks Deployed...');
    log('-------------------------------');
  }
};

module.exports.tags = ['all', 'mocks'];
