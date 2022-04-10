// compile code will go here
// Deployment and Testing process relies on deployment first
// Inputs: Source Code ==> solidity compiler
// Outputs: ABI, contract Bytecode

const path = require('path');
const fs = require('fs');
const solc = require('solc'); // solidity compiler

// Load the source code 
const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

// console.log(solc.compile(source, 1));

// Compile the contract and return only the definition
/**
 * Has two properties
 *  1) interface - ABI
 *  2) byte code - raw compiled contract
 */
module.exports = solc.compile(source, 1).contracts[':Inbox'];