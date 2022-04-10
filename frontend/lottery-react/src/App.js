import logo from "./logo.svg";
import "./App.css";
import React from "react";
import web3 from "./web3"
import lottery from "./lottery";
 
class App extends React.Component {
  // Equivalent to setting this.state in the constructor
  state = {
    manager: "",
    balance: '', // balance as a string
    players: [],
    value: '', // text input is empty string,
    message: ''
  };

  // Called whenever the App component pops up on screen
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address)
    this.setState({ manager: manager });
    this.setState({ balance });
    this.setState({ players});
  }

  /** Handler for a person to enter the lottery */
  onSubmit = async (event) => {
    // define a function like this then dont have to worry about this.x
    
    event.preventDefault();

    // Get the first account
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...'})

    // Enter into the contract
    await lottery.methods.enter().send({ 
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    })

    this.setState({ message: "You've been entered!" });
  }

  /** Handler for the account manager to pick a winner */
  pickWinner = async (event) => {
    // Get the first account
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Waiting on transaction success..." });

    // Try to call the pickwinner method on the smart contract
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    })

    this.setState({ message: "Winner has been chosen!" });
  }

  render() {
    web3.eth.getAccounts().then(console.log);

    return (
      <div className="App">
        <h2>Lottery Contract</h2>
        <p>This Contract manager is {this.state.manager}</p>
        <p>There are currently {this.state.players.length} people entered,
          competing to win {web3.utils.fromWei(this.state.balance, "ether")} ether!
        </p>
        <hr />
        <div>
          <form onSubmit={this.onSubmit}>
            <h4>Want to try your luck?</h4>
            <div>
              <label>Amount of ether to enter</label>
              <input
                value={this.state.value}
                onChange={event => this.setState({ value: event.target.value })}
                type="text" name="" id=""
              />
            </div>
            <button>Enter</button>
          </form>
          <hr />
          <h4>Ready to pick a winner?</h4>
          <button
            onClick={this.pickWinner}
          >Pick a winner!</button>

          <hr />
          <h3>{this.state.message}</h3>
        </div>
      </div>
    );
  }
}
export default App;