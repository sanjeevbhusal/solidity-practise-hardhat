// eslint-disable-next-line import/no-extraneous-dependencies
require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();
require('./tasks/blockNumber');
require('hardhat-gas-reporter');
require('solidity-coverage');
require('hardhat-deploy');

const { GOERLI_RPC_URL } = process.env;
const { GOERLI_PRIVATE_KEY } = process.env;
const { ETHERSCAN_GOERLI_API_KEY } = process.env;
const { COINMARKET_API_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [GOERLI_PRIVATE_KEY],
      chainId: 5,
    },
    localhost: {
      url: 'http://127.0.0.1:8545/',
      // accounts is provided by hardhat itself.
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_GOERLI_API_KEY,
  },
  gasReporter: {
    enabled: true,
    outputFile: 'gasReport.txt',
    noColors: true,
    currency: 'USD',
    coinmarketcap: COINMARKET_API_KEY,
    // token: "MATIC",
  },
  // eslint-disable-next-line max-len
  //  if you need multiple accounts on each blockchain for deployment purposes, testing purposes etc, you can use named accounts
  namedAccounts: {
    deployer: {
      // in this deployer account, the default account is on position 0 (accounts[0])
      default: 0,
      //   on goerli, we want the deployer account is on position 1 (accounts[1])
      5: 1,
    },
    // user is another account that might be used in other purposes such as testing.
    user: {
      default: 1,
    },
  },
  solidity: {
    compilers: [{ version: '0.8.17' }, { version: '0.6.6' }],
  },
};
