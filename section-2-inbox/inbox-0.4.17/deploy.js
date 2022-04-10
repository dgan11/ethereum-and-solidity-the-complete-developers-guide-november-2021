// deploy code will go here
require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require("./compile");

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.RINKEBY_INFURA
);

// Create an instance of web3 by passing in the provider
// we will use this web3 instance to interact with the blockchain
const web3 = new Web3(provider)


// Deploy the code -- very similar to Inbox.test
const deploy = async () => {
  // Get a list of accounts
  const accounts = await web3.eth.getAccounts();
  console.log('accounts[0]: ', accounts[0])

  // Create the new contract
  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['Hi There!'] })
    .send({ gas: '1000000', from: accounts[0] });
  
  console.log('Contract Deployed to: ', result.options.address);
  provider.engine.stop();
}
deploy();
