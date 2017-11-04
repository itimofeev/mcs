pragma solidity ^0.4.15;


contract Number {

	uint constant minPrice = 1 finney;

	uint public number;

	address public owner;

	function Number() public {
		owner = msg.sender;
	}

	function setNumber(uint _number) payable public {
		// Level 2 show number for some money
		require(msg.value >= minPrice);
		// Level 3 transfer money to owner that was sent to contract
		owner.transfer(msg.value);
		// Level 1 show number through public variable number
		number = _number;
	}
}