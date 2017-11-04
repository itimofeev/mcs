pragma solidity ^0.4.15;


contract Number {

	uint constant minPrice = 1 finney;

	uint public number;

	function setNumber(uint _number) payable public {
		require(msg.value >= minPrice);
		number = _number;
	}
}