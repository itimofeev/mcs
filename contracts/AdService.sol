pragma solidity ^0.4.15;


contract AdService {

	uint constant minPrice = 1 finney;

	uint constant lockPeriod = 10 * 60;// 10 minutes

	// advertising content
	string ad = "";

	address public owner;

	uint public unlockTime;

	function AdService() public {
		owner = msg.sender;
		unlockTime = now;
	}

	function publishAd(string _ad) payable public {
		// Level 2 show ad for some money
		require(msg.value >= minPrice);

		// Level 4 reserve message for 10 minutes
		require(now >= unlockTime);
		unlockTime = now + lockPeriod;

		// Level 3 transfer money to owner that was sent to contract
		owner.transfer(msg.value);

		// Level 1 show ad through public accessor getAd
		ad = _ad;
	}

	function getAd() constant public returns (string) {
		return ad;
	}
}