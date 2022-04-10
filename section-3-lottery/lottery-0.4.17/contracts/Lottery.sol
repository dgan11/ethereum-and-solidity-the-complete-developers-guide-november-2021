pragma solidity ^0.4.17;

// SPDX-License-Identifier: MIT

contract Lottery {
  address public manager;
  address[] public players;

  function Lottery() {
    manager = msg.sender;
  }

  // Enter the lottery by sending in some ETH
  function enter() public payable{
    require(msg.value > 0.01 ether);
    players.push(msg.sender);
  }

  // Helper function to generate a random number
  function random() private view returns (uint256) {
    // sha3() and keccak256() is the same
    return uint(keccak256(block.difficulty, now, players)); 
  }

  // Pick a winner
  function pickWinner() public restricted {  // added funciton modifier `restricted`
    // Make sure only the manager can call this
    // require(msg.sender == manager);
    uint index = random() % players.length;
    players[index].transfer(this.balance);
    players = new address[](0); // dynamic array with initial size of 0
  }

  // function modifier
  modifier restricted() {
      require(msg.sender == manager);
      _; // gets replaced by the functions code
  }

  function getPlayers() public view returns(address[]) {
      return players;
  }
}