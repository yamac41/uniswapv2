require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const ALCHEMY_API_KEY = 'J4_geREd4aVmr25leQPn76QSpT9z3E0S';

const SPRIVATE_KEY = '9b678ffe39c0a736e7a2f66784e1398a1edc7c507a27ce241195b0b81a97036c';

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  mocha: {
    timeout: 100000000
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.RPC_URL,
      },
    }, 
    mainnet: {
      url: 'https://eth-mainnet.g.alchemy.com/v2/hiJuTRS5UlImeBSiA_gOvm7skQzFrZFB',
      accounts: [SPRIVATE_KEY]
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 9999,
          },
        },
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  }
};
