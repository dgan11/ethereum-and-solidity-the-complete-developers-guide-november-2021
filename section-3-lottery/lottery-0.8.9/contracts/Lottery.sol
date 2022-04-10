// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

/**
  Notice of changes:
    - changed address[] to new address payable[] types
    - speciy data location of address payable[] in getPlayers function to memory
    - convert contract type to address payable[]
    - convert msg.sender to type 'address payable'

 */


contract Lottery {
  address public manager;
  address payable[] public players;

  constructor () { // refactor to use constructor key word
    manager = msg.sender;
  }

  function enter() public payable {
    require(msg.value > 0.01 ether);
    players.push(payable(msg.sender));
  }

  function random() private view returns (uint) {
    return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
  }

  modifier restricted() {
    require(msg.sender == manager);
    _;
  }

  function pickWinner() public restricted {
    uint index = random() % players.length;
    players[index].transfer(address(this).balance);
    players = new address payable[](0);
  }

  function getPlayers() public view returns(address payable[] memory) {
    return players;
  }

}