const { ethers, network } = require("hardhat");

async function main() {
  const contractFactory = await ethers.getContractFactory("SimpleStorage");

  console.log("Deploying the contract ......");
  const contract = await contractFactory.deploy();
  await contract.deployed();

  if (
    network.config.chainId !== 31337 &&
    process.env.ETHERSCAN_GOERLI_API_KEY
  ) {
    await contract.deployTransaction.wait(5);
    await verify(contract.address, []);
  }
}

async function verify(contractAddress, constructorArguments) {
  console.log("Verifying Contract ....");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: constructorArguments,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("contract already verified")) {
      console.log("Contract is already verified");
    } else {
      console.log(e.message);
    }
  }
}

//
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//9: 06: 38
