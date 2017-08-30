# Deploying To Ropsten

## Motivation

When developing Ethereum-based applications, you will eventually need to deploy your smart contracts to the mainnet. Running a local node with testrpc doesn't nearly capture the user  experience of transacting on a public chain - most notably the fact that nodes on different blockchains may have different protocols as well as that transactions on the testnet exhibit delays typical of blockchain technology. 

In order to deploy these, you're going to need testnet ether for your testnet of choice. In our case, we are using Ropsten because we built a POA [Faucet](https://faucet.transmute.industries) for Ropsten before Rinkeby and Kovan existed. 

Note: We will soon be moving over to one of the newer testnets.

## Deployment Setup

### [TestRPC](https://github.com/ethereumjs/testrpc) (Local)
```
$ npm install -g truffle
$ npm install -g ethereumjs-testrpc
```

### [Sigmate](https://github.com/DigixGlobal/sigmate)
This will allow you to create a wallet that you can easily use with Truffle to deploy your smart contracts to the testnet.
```
$ npm install -g @digix/sigmate
```

### [Geth](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum)
These commands will install geth with brew and begin syncing your local testnet node with the rest of the network.
```
$ brew tap ethereum/ethereum
$ brew install ethereum
$ geth --testnet account new
$ geth --testnet --fast --rpc --rpcapi eth,net,web3,personal
```

## Project

### Setup and Testing
```
$ git clone git@github.com:transmute-industries/ropsten-example.git
$ cd ropsten-example
ropsten-example $ npm install
ropsten-example $ testrpc
ropsten-example $ truffle test
```

### Deployment with Sigmate
Quit testrpc and make sure that it is not running in the background before proceeding.
```
ropsten-example $ sigmate keystore
```
After creating your wallet, make sure to fund it using the Austin Faucet, ask in gitter, or just ask someone in Austin Ethereum Slack to give you some testnet Ether.

You're going to update your truffle.js file to point to Ropsten:

```
'ropsten': {
  provider: new LightWalletProvider({
    keystore: process.env.SIGMATE,
    password: process.env.PASSWORD,
    rpcUrl: 'https://ropsten.infura.io',
    debug: true,
    pollingInterval: 2000
  }),
  network_id: '*'
}
```

Run the command:
```
ropsten-example $ truffle migrate --network ropsten
```

And voila, you have smart contracts on the Ropsten testnet.

### Deployment with Geth
If your node has not finished syncing, **this will not work**. Make sure you have geth running with the command listed above.

```
ropsten-example $ geth attach http://127.0.0.1:8545
```

In the geth console (the index is of the account that you just created - it may or may not be 0):
```
personal.unlockAccount(eth.accounts[0])
```

You're going to update your truffle.js file to point to Ropsten:

```
'ropsten': {
  host: 'localhost',
  port: 8545,
  network_id: '3'
}
```

Run the command:
```
ropsten-example $ truffle migrate --network ropsten
```

And voila, you once again have smart contracts on the Ropsten testnet.
