var Ownable = artifacts.require('./zeppelin/ownership/Ownable.sol')
var Killable = artifacts.require('./zeppelin/lifecycle/Killable.sol')

var AddressSetLib = artifacts.require('./SetLib/AddressSetLib.sol')

var TreasureChest = artifacts.require('./TreasureChest.sol')
var TreasureChestFactory = artifacts.require('./TreasureChestFactory.sol')

module.exports = function(deployer) {
  deployer.deploy(Ownable)
  deployer.link(Ownable, Killable)
  deployer.deploy(Killable)

  deployer.deploy(AddressSetLib)

  deployer.link(Killable, TreasureChest)
  deployer.deploy(TreasureChest)

  deployer.link(AddressSetLib, TreasureChestFactory)
  deployer.link(TreasureChest, TreasureChestFactory)
  deployer.deploy(TreasureChestFactory)
}
