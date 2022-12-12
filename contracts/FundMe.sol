// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import '@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol';
import './PriceConverter.sol';

error FundMe__NotOwner();
error FundMe__NotEnoughETH();
error FundMe__WithdrawFailed();

contract FundMe {
  using PriceConverter for uint256;

  mapping(address => uint256) private s_addressToAmountFunded;
  address[] private s_funders;

  address private i_owner;
  uint256 public constant MINIMUM_USD = 50 * 10 ** 18;
  AggregatorV3Interface private s_priceFeed;

  modifier onlyOwner() {
    if (msg.sender != i_owner) revert FundMe__NotOwner();
    _;
  }

  constructor(address priceFeedContractAddress) {
    i_owner = msg.sender;
    s_priceFeed = AggregatorV3Interface(priceFeedContractAddress);
  }

  fallback() external payable {
    fund();
  }

  receive() external payable {
    fund();
  }

  function fund() public payable {
    if (msg.value.getConversionRate(s_priceFeed) <= MINIMUM_USD)
      revert FundMe__NotEnoughETH();
    s_addressToAmountFunded[msg.sender] += msg.value;
    s_funders.push(msg.sender);
  }

  function withdraw() public onlyOwner {
    for (
      uint256 funderIndex = 0;
      funderIndex < s_funders.length;
      funderIndex++
    ) {
      address funder = s_funders[funderIndex];
      s_addressToAmountFunded[funder] = 0;
    }

    s_funders = new address[](0);
    (bool callSuccess, ) = payable(msg.sender).call{
      value: address(this).balance
    }('');

    if (!callSuccess) revert FundMe__WithdrawFailed();
  }

  function cheaperWithdraw() public onlyOwner {
    address[] memory funders = s_funders;

    for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
      address funder = funders[funderIndex];
      s_addressToAmountFunded[funder] = 0;
    }

    s_funders = new address[](0);
    (bool callSuccess, ) = i_owner.call{value: address(this).balance}('');

    if (!callSuccess) revert FundMe__WithdrawFailed();
  }

  function getOwner() public view returns (address) {
    return i_owner;
  }

  function getFunders(uint256 index) public view returns (address) {
    return s_funders[index];
  }

  function getAmountFunded(address userAddress) public view returns (uint256) {
    return s_addressToAmountFunded[userAddress];
  }

  function getPriceFeed() public view returns (AggregatorV3Interface) {
    return s_priceFeed;
  }
}
