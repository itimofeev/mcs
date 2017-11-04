pragma solidity ^0.4.15;

contract Hello {

  uint public number;

  function setNumber(uint _number) public {
    number = _number;
  }
}