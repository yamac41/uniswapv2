const { expect , assert } = require("chai");
const { ethers, network } = require("hardhat");
require('dotenv').config();

const tokenAddress = "0xDf82ad29f859E7c25D155d9E35D8533f46928CA9"; // Replace with your token address

describe("Start Audit!", async function () {
  let Detector, BuyContract;

  // it("Check buyMethod1", async function () {
  //   [deployer, wallet1, wallet2, wallet3] = await ethers.getSigners();
  //   await network.provider.request({
  //     method: "hardhat_reset",
  //     params: [
  //       {
  //         forking: {
  //           jsonRpcUrl: process.env.RPC_URL,
  //           blockNumber: 20128010,
  //         },
  //       },
  //     ],
  //   });

  //   const BuyContract_deploy = await ethers.getContractFactory("BuyContract");
  //   const BuyContract_deployed = await BuyContract_deploy.deploy();
  //   BuyContract = await BuyContract_deployed.deployed();

  //   const tokenABI = [
  //     "function balanceOf(address owner) view returns (uint256)",
  //     "function decimals() view returns (uint8)"
  //   ];

  //   // Get a contract instance
  //   const tokenContract = new ethers.Contract(tokenAddress, tokenABI, ethers.provider);

  //   const wallet1BalanceBeforeSwap = await wallet1.getBalance();
  //   await BuyContract.connect(wallet1).buyMethod1(tokenAddress, "50000000000", 30, {value: ethers.utils.parseEther("1")});
  //   console.log(await ethers.provider.getBalance(BuyContract.address));
  //   console.log(await tokenContract.balanceOf(wallet1.address));
  //   console.log(ethers.utils.formatEther(wallet1BalanceBeforeSwap.sub(await wallet1.getBalance())))

  //   await BuyContract.connect(wallet2).buyMethod1(tokenAddress, "50000000000", 30, {value: ethers.utils.parseEther("0.02")});
  //   console.log(await ethers.provider.getBalance(BuyContract.address));
  //   console.log(await tokenContract.balanceOf(wallet2.address));
  // });

  // it("Check buyMethod2", async function () {
  //   [deployer, wallet1, wallet2, wallet3] = await ethers.getSigners();
    
  //   await network.provider.request({
  //     method: "hardhat_reset",
  //     params: [
  //       {
  //         forking: {
  //           jsonRpcUrl: process.env.RPC_URL,
  //           blockNumber: 20128633,
  //         },
  //       },
  //     ],
  //   });

  //   const BuyContract_deploy = await ethers.getContractFactory("BuyContract");
  //   const BuyContract_deployed = await BuyContract_deploy.deploy();
  //   BuyContract = await BuyContract_deployed.deployed();

  //   const tokenABI = [
  //     "function balanceOf(address owner) view returns (uint256)",
  //     "function decimals() view returns (uint8)"
  //   ];

  //   // Get a contract instance
  //   const tokenContract = new ethers.Contract(tokenAddress, tokenABI, ethers.provider);
    
  //   // Send ETH to the contract
  //   const amountETH = ethers.utils.parseEther("1.0"); // 1 ETH
  //   await wallet1.sendTransaction({ to: BuyContract.address, value: amountETH });
    
  //   const wallet1BalanceBeforeSwap = await wallet1.getBalance();

  //   let targetBlockNumber = await ethers.provider.getBlockNumber() + 1;

  //   await BuyContract.connect(wallet1).buyMethod2(tokenAddress, ethers.utils.parseEther("0.1"), "5000000000000000000", targetBlockNumber, ethers.utils.parseEther("0.01"));
  //   console.log(await ethers.provider.getBalance(BuyContract.address));
  //   console.log(await tokenContract.balanceOf(wallet1.address));
  //   console.log(ethers.utils.formatEther(wallet1BalanceBeforeSwap.sub(await wallet1.getBalance())))

  //   targetBlockNumber = await ethers.provider.getBlockNumber() + 1;
  //   await BuyContract.connect(wallet2).buyMethod2(tokenAddress, ethers.utils.parseEther("0.1"), "50000000000", targetBlockNumber, ethers.utils.parseEther("0"));
  //   console.log(await ethers.provider.getBalance(BuyContract.address));
  //   console.log(await tokenContract.balanceOf(wallet2.address));
  // });

  it('Check Sell', async function () {
    [deployer, wallet1, wallet2] = await ethers.getSigners();
    
    await network.provider.request({
      method: "hardhat_reset",
      params: [
        {
          forking: {
            jsonRpcUrl: process.env.RPC_URL,
            blockNumber: 20129888,
          },
        },
      ],
    });

    const BuyContract_deploy = await ethers.getContractFactory("BuyContract");
    const BuyContract_deployed = await BuyContract_deploy.deploy();
    BuyContract = await BuyContract_deployed.deployed();

    const tokenABI = [
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)",
      "function transfer(address to, uint256 amount) public", // Add this function to the ABI
      "function approve(address spender, uint256 amount) public",// Add this function to
      "function allowance(address owner, address spender) external view returns (uint)"
    ];

    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, ethers.provider);

    const amountETH = ethers.utils.parseEther("1.0"); // 1 ETH
    await wallet1.sendTransaction({ to: BuyContract.address, value: amountETH });

    let targetBlockNumber = await ethers.provider.getBlockNumber() + 1;

    await BuyContract.connect(wallet1).buyMethod2(tokenAddress, ethers.utils.parseEther("0.1"), "5000000000000000000", targetBlockNumber, ethers.utils.parseEther("0.01"));
    
    await tokenContract.connect(wallet1).approve(BuyContract.address, "0xffffffffffffffffffffffffff");
    await tokenContract.allowance(wallet1.address, BuyContract.address);
    
    console.log('before---', await wallet1.getBalance(), await tokenContract.balanceOf(wallet1.address));
    await BuyContract.connect(wallet1).sellToken(tokenContract.address, "5000000000000000000", ethers.utils.parseEther("0.05"));
    console.log('after---', await wallet1.getBalance(), await tokenContract.balanceOf(wallet1.address));
  })
});
