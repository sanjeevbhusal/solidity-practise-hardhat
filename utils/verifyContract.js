const { run } = require('hardhat');

const verifyContract = async (contractAddress, constructorArguments) => {
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
};

module.exports = { verifyContract };
