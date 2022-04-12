//SPDX-License-Identifier:Unlicensed

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Token{

    string public name = "Vaxxed Shiba Token";
    string public symbol = "VST";

    uint public totalSupply = 100000;

    address public owner;

    mapping(address=>uint256) balances;

    constructor(){    
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    function transfer(address _to, uint256 _amount) external {
        require(balances[msg.sender] >= _amount , "Not enough tokens");
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
    }

    function balanceOf(address _account) external view returns (uint256){
        return balances[_account];
    }
}
