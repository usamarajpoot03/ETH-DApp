pragma solidity ^0.6.1;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(uint256 initialSupply) public ERC20("Winning Streaks", "WKS") {
        _mint(msg.sender, initialSupply);
    }
}