const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); 

// Require the abi and bytecode from our compiled file
const { interface, bytecode } = require('../compile');

const web3 = new Web3(ganache.provider()); // provider is the block we plug in

let lottery;
let accounts;

// Deploy a new contract every time we run a test
beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  
  // Use one of those accounts to deploy a contract
  lottery = await new web3.eth.Contract(JSON.parse(interface))  // parse JSON to js object
    .deploy({ data: bytecode})  // Initial message
    .send({ from: accounts[0], gas: '1000000' })              // Use first account as deployer 
});

/**
 * What tests should we write? What behavior do we really care about?
 * 
 * 1. If they enter their address gets added
 * 2. User has to send in the appropiate amount of ether to enter
 */

describe('Lottery Contract Tests', () => {
  it('should deploy a contract', () => {
    //console.log('lottery: ', lottery);
    assert.ok(lottery.options.address) // check that it is a defined value
  });

  it('allows an account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0], 
      value: web3.utils.toWei('0.011', 'ether')
    })
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });
    assert.equal(players.length, 1)
    assert.equal(accounts[0], players[0])
  })

  it("allows multiple accounts to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.011", "ether"),
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.011", "ether"),
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei("0.011", "ether"),
    });
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });
    assert.equal(players.length, 3);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
  });

  it("requires a minimum amount of ether to enter", async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0], 
        value: web3.utils.toWei("0.01", "ether")
      })
      assert(false); // always going to fail our test -- should not hit this statement
    } catch (err) {
      // Should throw an error
      assert(err);  // ok just checks that the value exists
    }
  })

  it("only the manager can call pickWinner", async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[1], // manager was account[0]
      });
      assert(false)
    } catch (err) {
      assert(err)
    }
  });

  it("sends money to the winner and resets the players array", async () => {
    // End to end test
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether')
    })

    // get the balance of an account
    const initialBalance = await web3.eth.getBalance(accounts[0])

    // pick the winner
    await lottery.methods.pickWinner().send({
      from : accounts[0]
    })

    const finalBalance = await web3.eth.getBalance(accounts[0])
    const difference = finalBalance - initialBalance;
    console.log('difference: ', difference);
    assert(difference > web3.utils.toWei('1.8', 'ether'))

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    })  
    assert.equal(players.length, 0);
  })
  
});
