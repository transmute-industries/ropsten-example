const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

const TreasureChest = artifacts.require('./TreasureChest.sol')
const TreasureChestFactory = artifacts.require('./TreasureChestFactory.sol')

describe('', () => {

    let factory, treasureChest

    before(async () => {
        factory = await TreasureChestFactory.deployed()
    })

    contract('TreasureChest', (accounts) => {

        it('the factory caller is the treasure chest contract creator', async () => {
            let _tx = await factory.createTreasureChest({ from: accounts[0], gas: 2000000, value: 5000000000000000000 })
            let event = _tx.logs[0].args
            let tcAddress = event._address
            treasureChest = TreasureChest.at(tcAddress)
            let creator = await treasureChest.creator()
            assert(creator === accounts[0])
        })

        it('the factory is the treasure chest owner', async () => {
            let owner = await treasureChest.owner()
            assert(owner === factory.address)
        })

        it('steal', async () => {
            // Create first TreasureChest
            let _startingBalance = await web3.eth.getBalance(accounts[2])
            let _tx = await treasureChest.steal({ from: accounts[2], gas: 2000000 })
            let _endingBalance = await web3.eth.getBalance(accounts[2])

            assert(parseInt(_endingBalance) - parseInt(_startingBalance) > 4990000000000000000, 'expected ending balance to be the sum of starting balance and treasure chest amount minus gas')
        })
    })
})
