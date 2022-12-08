require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("./tasks/blockNumber");
require("hardhat-gas-reporter");

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY;
const ETHERSCAN_GOERLI_API_KEY = process.env.ETHERSCAN_GOERLI_API_KEY;
const COINMARKET_API_KEY = process.env.COINMARKET_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [GOERLI_PRIVATE_KEY],
      chainId: 5,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      //accounts is provided by hardhat itself.
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_GOERLI_API_KEY,
  },
  gasReporter: {
    enabled: true,
    outputFile: "gasReport.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKET_API_KEY,
  },
  solidity: "0.8.17",
};
