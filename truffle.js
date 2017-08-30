const LightWalletProvider = require('@digix/truffle-lightwallet-provider')

module.exports = {
  networks: {
    'development': {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    // 'ropsten': {
    //   provider: new LightWalletProvider({
    //     keystore: './sigmate-v3-austin-ethereum.json',
    //     password: process.env.PASSWORD,
    //     rpcUrl: 'https://ropsten.infura.io',
    //     debug: true,
    //     pollingInterval: 2000
    //   }),
    //   network_id: '*'
    // }
    'ropsten': {
      host: 'localhost',
      from: process.env.FROM,
      port:  8545,
      gas:   2900000,
      network_id: 3
    }
  }
};
