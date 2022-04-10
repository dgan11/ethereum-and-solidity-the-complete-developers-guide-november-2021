// contract test code will go here
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); // constructor function/class that creates instances
const { interface, bytecode } = require('../compile');

// create an instance of web3 (lowercase)
// can replace with Rinkeby or other network
const web3 = new Web3(ganache.provider());

let accounts;
let inbox;
const INITIAL_STRING = "Hello World!"

// Deploy a new contract every time we run a test
beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  
  // Use one of those accounts to deploy a contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))  // parse JSON to js object
    .deploy({ data: bytecode, arguments: [INITIAL_STRING] })  // Initial message
    .send({ from: accounts[0], gas: '1000000' })              // Use first account as deployer 
});

describe('Inbox Contract Tests', () => {
  it('should deploy a contract', () => {
    //console.log(inbox);
    assert.ok(inbox.options.address) // check that it is a defined value
  });

  // # Test that calls a read method on our contract
  it("has a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_STRING);
  });

  // # Test that calls a write method on our contract
  it("can set a new message", async () => {
    // have to specify who the transaction is from and how much they pay
    await inbox.methods.setMessage("new message").send({
      from: accounts[0],
      gas: "1000000",
    });
    
    // check the new message
    const newMessage = await inbox.methods.message().call();
    assert.equal(newMessage, "new message");
  })
});