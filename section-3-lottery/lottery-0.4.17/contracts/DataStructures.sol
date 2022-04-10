// SPDX-License-Identifier: MIT

pragma solidity ^0.4.17

contract DataStructures {
  uint[] public myArray;

  function DataStructures() public {
    myArray.push(1)
  }

  funtion getArrayLength() public view returns (uint) {
    return myArray.length;
  }

  function getFirstElement() public view returns (uint) {
    return myArray[0];
  }

}