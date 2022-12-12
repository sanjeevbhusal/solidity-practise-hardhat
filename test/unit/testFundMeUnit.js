const { deployments, ethers, getNamedAccounts, network } = require('hardhat');
const { assert, expect } = require('chai');
const { developmentChains } = require('../../helperHardhat.config');

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('testing the functionality of FundMe contract', async () => {
      let deployerAddress;
      let fundMeContract;
      let mockV3Aggregator;
      const sendValue = ethers.utils.parseEther('1');

      beforeEach('deploying the contract', async () => {
        // run all files inside deploy folder with the tag `all`
        await deployments.fixture(['all']);
        deployerAddress = (await getNamedAccounts()).deployer;

        // fetch a contracts deployment
        let fundMe = await deployments.get('FundMe');
        mockV3Aggregator = await deployments.get('MockV3Aggregator');

        // creats a contract object based upon the abi
        fundMeContract = await ethers.getContractAt(fundMe.abi, fundMe.address);
      });

      describe('constructor', async () => {
        it('sets the address of aggregator correctly ', async () => {
          const aggregatorAddress = await fundMeContract.getPriceFeed();
          assert.equal(mockV3Aggregator.address, aggregatorAddress);
        });
      });

      describe('fund', async () => {
        it('fails if you donot send enough ETH', async () => {
          await expect(fundMeContract.fund()).to.be.revertedWithCustomError(
            fundMeContract,
            'FundMe__NotEnoughETH'
          );
        });

        it('updates the address -> amount Mapping data structure', async () => {
          await fundMeContract.fund({ value: sendValue });
          const amountFunded = await fundMeContract.getAmountFunded(
            deployerAddress
          );
          assert.equal(amountFunded.toString(), sendValue);
        });

        it('add the deployer to the getFunders array', async () => {
          await fundMeContract.fund({ value: sendValue });
          const funderAddress = await fundMeContract.getFunders(0);
          assert.equal(funderAddress, deployerAddress);
        });
      });

      describe('withdraw', async () => {
        beforeEach('populate the contract with some balance', async () => {
          await fundMeContract.fund({ value: sendValue });
        });

        it('correctly withdraws ETH from the contract with single Funder', async () => {
          // Arrrange
          const initialFundMeBalance = await ethers.provider.getBalance(
            fundMeContract.address
          );
          const initialDeployerBalance = await ethers.provider.getBalance(
            deployerAddress
          );

          // Act
          const transactionResponse = await fundMeContract.withdraw();
          const { gasUsed, effectiveGasPrice } =
            await transactionResponse.wait();
          const gasCost = gasUsed * effectiveGasPrice;

          const updatedFundMeBalance = await ethers.provider.getBalance(
            fundMeContract.address
          );
          const updatedDeployerBalance = await ethers.provider.getBalance(
            deployerAddress
          );

          // Assert
          const expectedFundMeBalance = 0;
          const expectedDeployerBalance = initialDeployerBalance
            .add(initialFundMeBalance)
            .sub(gasCost);

          assert.equal(expectedFundMeBalance, updatedFundMeBalance.toString());
          assert.equal(
            expectedDeployerBalance.toString(),
            updatedDeployerBalance.toString()
          );

          // funder's array is empty after withdrawing
          await expect(fundMeContract.getFunders(0)).to.be.reverted;

          //   getFunders to amount mapping should  reset properly
          const amount = await fundMeContract.getAmountFunded(deployerAddress);
          assert.equal(amount, 0);
        });

        it('cheaper withdraw single Funder', async () => {
          // Arrrange
          const initialFundMeBalance = await ethers.provider.getBalance(
            fundMeContract.address
          );
          const initialDeployerBalance = await ethers.provider.getBalance(
            deployerAddress
          );

          // Act
          const transactionResponse = await fundMeContract.cheaperWithdraw();
          const { gasUsed, effectiveGasPrice } =
            await transactionResponse.wait();
          const gasCost = gasUsed * effectiveGasPrice;

          const updatedFundMeBalance = await ethers.provider.getBalance(
            fundMeContract.address
          );
          const updatedDeployerBalance = await ethers.provider.getBalance(
            deployerAddress
          );

          // Assert
          const expectedFundMeBalance = 0;
          const expectedDeployerBalance = initialDeployerBalance
            .add(initialFundMeBalance)
            .sub(gasCost);

          assert.equal(expectedFundMeBalance, updatedFundMeBalance.toString());
          assert.equal(
            expectedDeployerBalance.toString(),
            updatedDeployerBalance.toString()
          );

          // funder's array is empty after withdrawing
          await expect(fundMeContract.getFunders(0)).to.be.reverted;

          //   getFunders to amount mapping should  reset properly
          const amount = await fundMeContract.getAmountFunded(deployerAddress);
          assert.equal(amount, 0);
        });

        it('correctly withdraws ETH from the contract with multiple getFunders', async () => {
          // Arrange
          const accounts = await ethers.getSigners();
          for (let i = 1; i < accounts.length; i++) {
            const fundMeConnectedContract = await fundMeContract.connect(
              accounts[i]
            );
            await fundMeConnectedContract.fund({ value: sendValue });
          }

          const initialFundMeBalance = await ethers.provider.getBalance(
            fundMeContract.address
          );
          const initialDeployerBalance = await ethers.provider.getBalance(
            deployerAddress
          );

          //   Act
          const transactionResponse = await fundMeContract.withdraw();
          const { gasUsed, effectiveGasPrice } =
            await transactionResponse.wait();
          const gasCost = gasUsed * effectiveGasPrice;

          const updatedFundMeBalance = await ethers.provider.getBalance(
            fundMeContract.address
          );
          const updatedDeployerBalance = await ethers.provider.getBalance(
            deployerAddress
          );

          // Assert
          const expectedFundMeBalance = 0;
          const expectedDeployerBalance = initialDeployerBalance
            .add(initialFundMeBalance)
            .sub(gasCost);

          assert.equal(expectedFundMeBalance, updatedFundMeBalance.toString());
          assert.equal(
            expectedDeployerBalance.toString(),
            updatedDeployerBalance.toString()
          );

          // funder's array is empty after withdrawing
          await expect(fundMeContract.getFunders(0)).to.be.reverted;

          // getFunders to amount mapping should  reset properly
          for (let i = 0; i < accounts.length; i++) {
            const amount = await fundMeContract.getAmountFunded(
              accounts[i].address
            );
            assert.equal(amount, 0);
          }
        });

        it('cheaper WithDraw Testing', async () => {
          // Arrange
          const accounts = await ethers.getSigners();
          for (let i = 1; i < accounts.length; i++) {
            const fundMeConnectedContract = await fundMeContract.connect(
              accounts[i]
            );
            await fundMeConnectedContract.fund({ value: sendValue });
          }

          const initialFundMeBalance = await ethers.provider.getBalance(
            fundMeContract.address
          );
          const initialDeployerBalance = await ethers.provider.getBalance(
            deployerAddress
          );

          //   Act
          const transactionResponse = await fundMeContract.cheaperWithdraw();
          const { gasUsed, effectiveGasPrice } =
            await transactionResponse.wait();
          const gasCost = gasUsed * effectiveGasPrice;

          const updatedFundMeBalance = await ethers.provider.getBalance(
            fundMeContract.address
          );
          const updatedDeployerBalance = await ethers.provider.getBalance(
            deployerAddress
          );

          // Assert
          const expectedFundMeBalance = 0;
          const expectedDeployerBalance = initialDeployerBalance
            .add(initialFundMeBalance)
            .sub(gasCost);

          assert.equal(expectedFundMeBalance, updatedFundMeBalance.toString());
          assert.equal(
            expectedDeployerBalance.toString(),
            updatedDeployerBalance.toString()
          );

          // funder's array is empty after withdrawing
          await expect(fundMeContract.getFunders(0)).to.be.reverted;

          // getFunders to amount mapping should  reset properly
          for (let i = 0; i < accounts.length; i++) {
            const amount = await fundMeContract.getAmountFunded(
              accounts[i].address
            );
            assert.equal(amount, 0);
          }
        });

        it('only allows owner to withdraw the funds', async () => {
          const attackerAccount = (await ethers.getSigners())[1];
          const attackerConnectedContract = await fundMeContract.connect(
            attackerAccount
          );
          await expect(
            attackerConnectedContract.withdraw()
          ).to.be.revertedWithCustomError(
            attackerConnectedContract,
            'FundMe__NotOwner'
          );
        });
      });
    });

// 12: 058
