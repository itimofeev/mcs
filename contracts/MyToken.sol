pragma solidity ^0.4.15;


import "./Ownable.sol";


contract MyToken {

	string public name;

	string public symbol;

	uint8 public decimals;

	uint256 public totalSupply;

	mapping (address => uint256) public balanceOf;

	mapping (address => mapping (address => uint256)) public allowance;

	event Transfer(address from, address to, uint256 value);

	event Approve(address from, address to, uint256 value);

	function MyToken() public {
		totalSupply = 10000 * 10 ** uint256(decimals);
		balanceOf[msg.sender] = totalSupply;
		name = "MyToken";
		symbol = "MTK";
		decimals = 8;
	}

	function transfer(address _to, uint256 _value) public {
		require(_to != 0x0);
		require(balanceOf[msg.sender] >= _value);
		require(balanceOf[_to] + _value >= balanceOf[_to]);

		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;

		Transfer(msg.sender, _to, _value);
	}

	function approve(address _spender, uint _value) public {
		allowance[msg.sender][_spender] = _value;
		Approve(msg.sender, _spender, _value);
	}

	function transferFrom(address _from, address _to, uint _value) public {
		require(allowance[_from][_to] >= _value);

		allowance[_from][_to] -= _value;

		require(_to != 0x0);
		require(balanceOf[_from] >= _value);
		require(balanceOf[_to] + _value >= balanceOf[_to]);

		balanceOf[_from] -= _value;
		balanceOf[_to] += _value;

		Transfer(_from, _to, _value);
	}
}