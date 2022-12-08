const { ethers } = require("hardhat");
const { assert, expect } = require("chai");

describe("first test", function () {
  let contract;

  beforeEach("deploys the smart contract to blockchain", async function () {
    const contractFactory = await ethers.getContractFactory("SimpleStorage");
    contract = await contractFactory.deploy();
    await contract.deployTransaction.wait(1);
  });

  it("zombies length should be 0", async function () {
    const totalZombies = await contract.totalZombies();
    assert.equal(totalZombies.toString(), "0");
  });

  it("zombies length should be updated to 1 after calling addZombie Function ", async function () {
    const transactionResponse = await contract.addZombie("1", "zombie 1");
    const transactionReceipt = transactionResponse.wait(1);

    const totalZombies = await contract.totalZombies();
    assert.equal(totalZombies.toString(), "1");
  });
});
