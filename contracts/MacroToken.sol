//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title MacroToken
/// @author Melvillian
/// @notice A simple ERC20 token that will be distributed in an Airdrop
contract MacroToken is ERC20 {

    mapping(address => bool) public owners;

    constructor(string memory _name, string memory _symbol)
    ERC20(_name, _symbol)
    {
        owners[msg.sender] = true;
    }

    function mint(address account, uint256 amount) external {
        require(owners[msg.sender], "ONLY_OWNER");
        _mint(account, amount);
    }

    function addAirdropOwner(address contractAddress) external {
        require(owners[msg.sender], "ONLY_OWNER");
        owners[contractAddress] = true;
    }

}
