var _ = require('lodash')

const TreasureChest = artifacts.require('./TreasureChest.sol')
const TreasureChestFactory = artifacts.require('./TreasureChestFactory.sol')

describe('', () => {

  contract('TreasureChestFactory', function (accounts) {

        var factory = null
        var account0TreasureChestAddresses = []
        var account1TreasureChestAddresses = []
        var treasureChestAddresses = []

        it('deployed', async () => {
            factory = await TreasureChestFactory.deployed()
            let owner = await factory.owner()
            assert(owner === accounts[0])
        })

        it('createTreasureChest.call', async () => {
            let firstTreasureChestAddress = await factory.createTreasureChest.call({ from: accounts[0], value: 1000000000000000000 })
            let _tx = await factory.createTreasureChest({ from: accounts[0], gas: 2000000, value: 1000000000000000000 })
            let event = _tx.logs[0].args
            let tcAddress = event._address

            assert.equal(tcAddress, firstTreasureChestAddress, 'expected treasure chest contract address to match call')

            treasureChestAddresses.push(tcAddress)
            account0TreasureChestAddresses.push(tcAddress)
        })

        it('createTreasureChest', async () => {
            // Create first TreasureChest
            let _tx = await factory.createTreasureChest({ from: accounts[0], gas: 2000000, value: 1000000000000000000 })
            let event = _tx.logs[0].args
            let tcAddress = event._address
            let tcc = await TreasureChest.at(tcAddress)
            let tccOwner = await tcc.creator()
            assert.equal(tccOwner, accounts[0], 'expect factory caller to be treasure chest contract owner.')

            treasureChestAddresses.push(tcAddress)
            account0TreasureChestAddresses.push(tcAddress)

            // Create second TreasureChest
            _tx = await factory.createTreasureChest({ from: accounts[1], gas: 2000000, value: 1000000000000000000 })
            event = _tx.logs[0].args
            tcAddress = event._address
            tcc = await TreasureChest.at(tcAddress)
            tccOwner = await tcc.creator()
            assert.equal(tccOwner, accounts[1], 'expect factory caller to be treasure chest contract owner.')

            treasureChestAddresses.push(tcAddress)
            account1TreasureChestAddresses.push(tcAddress)
        })

        it('getTreasureChests', async () => {
          let _addresses = await factory.getTreasureChests()
          assert(_.difference(treasureChestAddresses, _addresses).length === 0, 'Expect treasureChestAddresses to equal _addresses')
        })

        it('getTreasureChestsByCreator', async () => {
          let _account0TreasureChestAddresses = await factory.getTreasureChestsByCreator.call({ from: accounts[0] })
          assert(_.difference(_account0TreasureChestAddresses, account0TreasureChestAddresses).length === 0, 'Expect _account0TreasureChestAddresses to equal account0TreasureChestAddresses')

          let _account1TreasureChestAddresses = await factory.getTreasureChestsByCreator.call({ from: accounts[1] })
          assert(_.difference(_account1TreasureChestAddresses, account1TreasureChestAddresses).length === 0, 'Expect _account1TreasureChestAddresses to equal account1TreasureChestAddresses')

        })

        it('killTreasureChest', async () => {
          // Address 0 is the deployer of the factory, and the only one who can destroy treasure chests with it.
          let _tx = await factory.killTreasureChest(account0TreasureChestAddresses[0], { from: accounts[0] })
          let event = _tx.logs[0].args
          tcAddress = event._address
          assert.equal(tcAddress, account0TreasureChestAddresses[0], 'Expect the destroyed address in event to match the method call')
        })

        it('getTreasureChests', async () => {
          let _addresses = await factory.getTreasureChests()
          assert(!_.includes(_addresses, account0TreasureChestAddresses[0]), 'Expect killed treasure chest to not be in factory list')
          assert(_.includes(_addresses, account0TreasureChestAddresses[1]), 'Expect live treasure chest to be in list')
        })
    })
})
