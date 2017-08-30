pragma solidity ^0.4.11;

import './zeppelin/lifecycle/Killable.sol';

contract TreasureChest is Killable {

  address public creator;

  // Events
  event Steal(address indexed _to, uint indexed _amount);

  // Fallback
  function () payable {}

  // Constructor
  function TreasureChest()
    payable
  {
    creator = tx.origin;
  }

  // Interface
  function steal()
    public
  {
    require(this.balance > 0);
    require(msg.sender != creator);
    require(msg.sender.send(this.balance));
    Steal(msg.sender, this.balance);
  }
}
