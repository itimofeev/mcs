pragma solidity ^0.4.15;


contract Number {

	uint constant minPrice = 1 finney;

	uint constant lockPeriod = 10 * 60;// 10 minutes

	uint number;

	address public owner;

	uint public unlockTime;

	function Number() public {
		owner = msg.sender;
		unlockTime = now;
	}

	function setNumber(uint _number) payable public {
		// Level 2 show number for some money
		require(msg.value >= minPrice);

		// Level 4 reserve message for 10 minutes
		require(now >= unlockTime);
		unlockTime = now + lockPeriod;

		// Level 3 transfer money to owner that was sent to contract
		owner.transfer(msg.value);

		// Level 1 show number through public variable number
		number = _number;
	}

	function getNumber() constant public returns (uint) {
		return number;
	}
}