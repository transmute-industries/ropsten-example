pragma solidity ^0.4.11;

import "./TreasureChest.sol";
import "./SetLib/AddressSetLib.sol";
import "./zeppelin/ownership/Ownable.sol";

contract TreasureChestFactory is Ownable {

  using AddressSetLib for AddressSetLib.AddressSet;

  mapping (address => AddressSetLib.AddressSet) creatorTreasureChestMapping;
  AddressSetLib.AddressSet TreasureChestAddresses;

  // Events
  event TCCreated(address _address);
  event TCDestroyed(address _address);

  // Fallback
  function () payable { throw; }

  // Constructor
  function TreasureChestFactory() payable {}

  // Modifiers
  modifier checkExistence(address _TreasureChestAddress)
  {
    require(TreasureChestAddresses.contains(_TreasureChestAddress));
    _;
  }

  // Helper Functions
  function getTreasureChestsByCreator()
    public constant
    returns (address[])
  {
    return creatorTreasureChestMapping[msg.sender].values;
  }

  function getTreasureChests()
    public constant
    returns (address[])
  {
    return TreasureChestAddresses.values;
  }

  // Interface
	function createTreasureChest()
    payable
    returns (address)
  {
    require(msg.value != 0);

    // Interact With Other Contracts
		TreasureChest _newTreasureChest = (new TreasureChest).value(msg.value)();

    // Update State Dependent On Other Contracts
    TreasureChestAddresses.add(address(_newTreasureChest));
    creatorTreasureChestMapping[msg.sender].add(address(_newTreasureChest));

    TCCreated(address(_newTreasureChest));

    return address(_newTreasureChest);
	}

  function killTreasureChest(address _address)
    public
    checkExistence(_address)
  {
    // Validate Local State - Only the Factory owner can destroy treasure chests with this method
    require(this.owner() == msg.sender);

    TreasureChest _treasureChest = TreasureChest(_address);

    // Update Local State
    creatorTreasureChestMapping[_treasureChest.owner()].remove(_address);
    TreasureChestAddresses.remove(_address);

    _treasureChest.kill();

    TCDestroyed(_address);
  }
}
