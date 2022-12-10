const networkConfiguration = {
  5: {
    name: 'goerli',
    ethUsdPriceFeedAddress: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e',
  },
};

const developmentChains = ['hardhat', 'localhost'];
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;

module.exports = {
  networkConfiguration,
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
};
