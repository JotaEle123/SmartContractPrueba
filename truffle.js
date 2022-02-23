require('dotenv').config()
import HDWalletProvider from '@truffle/hdwallet-provider';

import fs from 'fs';

export const networks = {
  development: {
    host: "127.0.0.1",
    port: 8545,
    network_id: "*",
  },

  ropsten: {
    provider: function () {
      return new HDWalletProvider(process.env.PRIVATE_KEY, process.env.ROPSTEN_RPC_URL);
    },
    network_id: 3,
    skipDryRun: true,
  }
  /*
       rinkeby: {
        provider: function () {
          return new HDWalletProvider(process.env.PRIVATE_KEY, process.env.RINKEBY_RPC_URL);
        },
        network_id: 4,
        skipDryRun: true,
      },
      mainnet: {
        provider: function () {
          return new HDWalletProvider(process.env.PRIVATE_KEY, process.env.MAINNET_RPC_URL);
        },
        network_id: 1,
        skipDryRun: true,
      }  */
};
export const mocha = {};
export const compilers = {
  solc: {
    version: "0.8.9",
  }
};
export const db = {
  enabled: false
};
