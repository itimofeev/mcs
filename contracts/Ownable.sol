pragma solidity ^0.4.15;

contract Ownable {
	address public owner;

	function Ownable() public {
		owner = msg.sender;
	}

	modifier onlyOwner() {
		require(msg.sender == owner);
		_;
	}

	function transferOwner(address _newOwner) onlyOwner public {
		owner = _newOwner;
	}
}
