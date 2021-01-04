import React, { Component } from "react";

import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KYCContract from "./contracts/KYCContract.json";

import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded: false, addressToWhiteList: "0x12...",tokenSaleAddress: null,
            tokensCount: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and this.web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();

      this.myTokenInstance = new this.web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address,
      );

      this.myTokenSaleInstance = new this.web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address,
      );

      this.kycInstance = new this.web3.eth.Contract(
        KYCContract.abi,
        KYCContract.networks[this.networkId] && KYCContract.networks[this.networkId].address,
      );

      // Set this.web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.tokenTransferListner();
      this.setState({ loaded: true, tokenSaleAddress: MyTokenSale.networks[this.networkId].address },
        this.getTokensOfUser);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load this.web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({ 
      [name]: value 
    });
  }

  handleKYCWhiteListing = async () => {
      await this.kycInstance.methods.setKycCompleted(this.state.addressToWhiteList).send({from:this.accounts[0]})
      alert("Successfully added : "+ this.state.addressToWhiteList + " in whitelist");
  }

  getTokensOfUser = async () => {
    const tokens = await this.myTokenInstance.methods.balanceOf(this.accounts[0]).call();
    this.setState({
      tokensCount: tokens
    });
  }

  tokenTransferListner = () =>{

    this.myTokenInstance.events.Transfer({to: this.accounts[0]}).on("data",this.getTokensOfUser);
  }

  buyTokens = async () => {
    await this.myTokenSaleInstance.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0],value: this.web3.utils.toWei("1","wei")});
  }
  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Tokenize Assets</h1>
        <p>White Listing :</p>
       <p> Add Address to white list: </p>
        <input type="text" name="addressToWhiteList" value={this.state.addressToWhiteList}
        onChange={ this.handleInputChange }></input>
        <button type="button" onClick={this.handleKYCWhiteListing}>
          Add
        </button>
        <p>If you want to buy tokens you can send either( wei ) to this address: {this.state.tokenSaleAddress} </p>
        <p>You have currently  {this.state.tokensCount} tokens</p>
        <button type="button" onClick={this.buyTokens}> Buy More Tokens</button>
      </div>
    );
  }
}

export default App;
