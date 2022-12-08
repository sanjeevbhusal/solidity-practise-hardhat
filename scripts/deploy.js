const { ethers, network } = require("hardhat");

async function main() {
  const contractFactory = await ethers.getContractFactory("SimpleStorage");

  console.log("Deploying the contract ......");
  const contract = await contractFactory.deploy();
  await contract.deployed();

  if (network.config.chainId === 5 && process.env.ETHERSCAN_GOERLI_API_KEY) {
    await contract.deployTransaction.wait(5);
    await verify(contract.address, []);
  }

  const transactionResponse = await contract.addZombie(1, "sanjeev");
  await transactionResponse.wait(1);

  let zombies_length = await contract.totalZombies();
  console.log(zombies_length.toString());
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

//9: 18: 38
