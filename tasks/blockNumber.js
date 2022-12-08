const { task } = require("hardhat/config");

task("block_number", "prints the current block number").setAction(
  async (taskArgs, hre) => {
    let blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log(blockNumber);
  }
);
