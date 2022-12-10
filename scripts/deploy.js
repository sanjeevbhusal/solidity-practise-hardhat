// eslint-disable-next-line import/no-extraneous-dependencies
const { ethers, network } = require('hardhat');

async function main() {
  const contractFactory = await ethers.getContractFactory('SimpleStorage');

  // eslint-disable-next-line no-console
  console.log('Deploying the contract ......');
  const contract = await contractFactory.deploy();
  await contract.deployed();

  if (network.config.chainId === 5 && process.env.ETHERSCAN_GOERLI_API_KEY) {
    await contract.deployTransaction.wait(5);
    // eslint-disable-next-line no-use-before-define
    await verify(contract.address, []);
  }

  const transactionResponse = await contract.addZombie(1, 'sanjeev');
  await transactionResponse.wait(1);

  const zombiesLength = await contract.totalZombies();
  // eslint-disable-next-line no-console
  console.log(zombiesLength.toString());
}

async function verify(contractAddress, constructorArguments) {
  // eslint-disable-next-line no-console
  console.log('Verifying Contract ....');
  try {
    // eslint-disable-next-line no-undef
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes('contract already verified')) {
      // eslint-disable-next-line no-console
      console.log('Contract is already verified');
    } else {
      // eslint-disable-next-line no-console
      console.log(e.message);
    }
  }
}

//
main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exitCode = 1;
});

// 10: 00: 49
