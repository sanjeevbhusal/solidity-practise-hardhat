const { network, deployments, ethers, getNamedAccounts } = require('hardhat');
const { developmentChains } = require('../../helperHardhat.config');
const { assert } = require('chai');

developmentChains.includes(network.name)
  ? describe.skip
  : describe('testing the functionaity of fundMe contract in TestNet', async () => {
      let deployerAddress;
      let fundMeContract;
      let sendValue = ethers.utils.parseEther('0.2');

      beforeEach(async () => {
        deployerAddress = await getNamedAccounts().deployer;
        let fundMe = await deployments.get('FundMe');
        fundMeContract = await ethers.getContractAt(fundMe.abi, fundMe.address);
      });

      it('allows people to fund and withdraw ', async () => {
        let transactionResponse;
        transactionResponse = await fundMeContract.fund({ value: sendValue });
        // await transactionResponse.wait(2);
        transactionResponse = await fundMeContract.withdraw();
        // await transactionResponse.wait(2);
        const contractBalance = await ethers.provider.getBalance(
          fundMeContract.address
        );
        assert.equal(contractBalance.toString(), '0');
      });
    });
