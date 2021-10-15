/// What version of solidity we are running
pragma solidity ^0.8.0;

// SPDX-License-Identifier: MIT

/// Create a new contract or class -- with some number of variables and functions
contract Inbox {
    
    /// Declare all the instance variable (and types) that will exist for the life of the contract 
    // storage variable that is persistent NOT a local variable
    string public message; // public variables have a "getter" function created automatically by the contract
    
    /// Constructor function -- auto called when deployed to the blockchain
    constructor(string memory initialMesage) {
        message = initialMesage;
    }
    
    /// Other functions we can call on the contract after it has been deployed
    function setMessage(string memory newMessage) public {
        message = newMessage;
    }
    
    /**
     * Common Function Types:
     *  1. public   - anyone can call this Function
     *  2. private  - only the contract can call this Function
     *  3. view     - function returns data and does not modify the contract
     *  4. constant - same as view but older
     *  5. pure     - Function does not modify or even read contract's data
     *  6. payable  - When someone calls, they may send ether along
     */
}