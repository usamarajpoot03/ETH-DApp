var MyToken = artifacts.require("MyToken.sol");
var MyTokenSale = artifacts.require("MyTokenSale.sol");
var KYCContract = artifacts.require("KYCContract.sol");

require("dotenv").config({
    path: "../.env"
});

module.exports = async function (deployer) {

    //all accounts created
    const accounts = await web3.eth.getAccounts();

    console.log("account using for depoyment: "+ accounts[0]);
    //deploy MyToken ERC20 Token with initial supply
    await deployer.deploy(MyToken, process.env.INITIAL_TOKENS);
    
     //deply KYC Contract or customer validations
    await deployer.deploy(KYCContract);
    
    //deploy MyTokenSale ( Crowdsale ) with rate, account which will be used to have the receiving money,
    // & address of our ERC20 Token
    await deployer.deploy(MyTokenSale, 1, accounts[0], MyToken.address, KYCContract.address);

   

    // get the deployed instance of our ERC20 Token
    const tokenInstance = await MyToken.deployed();

    //*
    //send all the tokens to our crowdsale so it will be able to manage them ( sale, buy)
    tokenInstance.transfer(MyTokenSale.address, process.env.INITIAL_TOKENS);

    //* who is doing this call ? as the 
    // ANS : Its the msg.sender which holds all the tokens initially
    //: address which we are passing to crowdsale is only to receive money in exchange of tokens
}