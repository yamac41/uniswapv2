const { expect } = require("chai");
const { ethers } = require("hardhat");

const FACTORY = "0x7E0987E5b3a30e3f2828572Bb659A548460a3003";
const WETH = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";


describe("UniswapV2Router02", function () {
  let factory;
  let weth;
  let router;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the UniswapV2Router02 contract
    const UniswapV2Router02 = await ethers.getContractFactory("UniswapV2Router02");
    router = await UniswapV2Router02.deploy(FACTORY, WETH);
    await router.deployed();
  });

  it("should deploy the router with correct factory and WETH addresses", async function () {
    expect(await router.factory()).to.equal(FACTORY);
    expect(await router.WETH()).to.equal(WETH);
  });

  it("getAmountOut", async function () {
    const amountIn = ethers.BigNumber.from(2);
    const reserveIn = ethers.BigNumber.from(100);
    const reserveOut = ethers.BigNumber.from(100);

    // Test for a valid input
    expect(await router.getAmountOut(amountIn, reserveIn, reserveOut)).to.equal(ethers.BigNumber.from(1));

    // Test for insufficient input amount
    await expect(router.getAmountOut(ethers.BigNumber.from(0), reserveIn, reserveOut)).to.be.revertedWith(
      "UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT"
    );

    // Test for insufficient liquidity
    await expect(router.getAmountOut(amountIn, ethers.BigNumber.from(0), reserveOut)).to.be.revertedWith(
      "UniswapV2Library: INSUFFICIENT_LIQUIDITY"
    );

    await expect(router.getAmountOut(amountIn, reserveIn, ethers.BigNumber.from(0))).to.be.revertedWith(
      "UniswapV2Library: INSUFFICIENT_LIQUIDITY"
    );
  });
});