import React from "react";

import {
  Container,
  Row,
  Card,
  Col,
  ListGroup,
  Form,
  Badge,
} from "react-bootstrap";
import { Button } from "react-bootstrap";

import MyToken from ".././contracts/MyToken.json";
import MyTokenSale from ".././contracts/MyTokenSale.json";
import KYCContract from ".././contracts/KYCContract.json";
import getWeb3 from ".././getWeb3";

import LoadingSpinner from "./LoadingSpinner";
import BuyTokensForm from "./BuyTokensForm";

class HomePage extends React.Component {
  state = {
    loaded: false,
    addressToWhiteList: "",
    tokenSaleAddress: null,
    tokensCount: 0,
    totalSupply: 0,
  };

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
        MyToken.networks[this.networkId] &&
          MyToken.networks[this.networkId].address
      );

      this.myTokenSaleInstance = new this.web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[this.networkId] &&
          MyTokenSale.networks[this.networkId].address
      );

      this.kycInstance = new this.web3.eth.Contract(
        KYCContract.abi,
        KYCContract.networks[this.networkId] &&
          KYCContract.networks[this.networkId].address
      );

      // Set this.web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.getTotalSupply();
      this.tokenTransferListner();
      this.setState(
        {
          loaded: true,
          tokenSaleAddress: MyTokenSale.networks[this.networkId].address,
        },
        this.getTokensOfUser
      );
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load this.web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  };

  handleKYCWhiteListing = async () => {
    await this.kycInstance.methods
      .setKycCompleted(this.state.addressToWhiteList)
      .send({ from: this.accounts[0] });
    alert(
      "Successfully added : " + this.state.addressToWhiteList + " in whitelist"
    );
  };

  getTokensOfUser = async () => {
    const tokens = await this.myTokenInstance.methods
      .balanceOf(this.accounts[0])
      .call();
    this.setState({
      tokensCount: tokens,
    });
    this.getTotalSupply();
  };

  getTotalSupply = async () => {
    const totalSupply = await this.myTokenInstance.methods.totalSupply().call();
    console.log("totalSupply : " + totalSupply);
    this.setState({
      totalSupply: totalSupply,
    });
  };

  tokenTransferListner = () => {
    this.myTokenInstance.events
      .Transfer({ to: this.accounts[0] })
      .on("data", this.getTokensOfUser);
  };

  buyTokens = async () => {
    await this.myTokenSaleInstance.methods.buyTokens(this.accounts[0]).send({
      from: this.accounts[0],
      value: this.web3.utils.toWei("1", "wei"),
    });
  };
  render() {
    if (!this.state.loaded) {
      return (
        <LoadingSpinner msg="Loading Web3, Accounts and Contract..."></LoadingSpinner>
      );
    }
    return (
      <div>
        <Container>
          <Row className="RowSpacing">
            <Col>
              <div style={{ float: "left" }}>
                {" "}
                <Form inline>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Account Address : </Form.Label>

                    <Form.Control
                      onChange={this.handleInputChange}
                      value={this.state.addressToWhiteList}
                      type="text"
                      name="addressToWhiteList"
                      placeholder="0x23AEFD3A3454556456324323434D"
                    />

                    <Button type="button" onClick={this.handleKYCWhiteListing}>
                      Add
                    </Button>
                  </Form.Group>
                </Form>
              </div>
              <h5 style={{ float: "right" }}>
                <Badge variant="secondary">
                  Total Supply ( no of tokens ) : {this.state.totalSupply}
                </Badge>
              </h5>
            </Col>
          </Row>

          <Row className="RowSpacing">
            <Col md={{ span: 6, offset: 3 }}>
              <Card style={{ width: "100%" }}>
                <Card.Header as="h5">
                  You currently own : {this.state.tokensCount} Token(s)
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h6>
                      If you want to buy tokens you can send Ether ( wei ) to
                      this address :
                      <Badge variant="light">
                        {this.state.tokenSaleAddress}
                      </Badge>
                    </h6>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
              <Button
                style={{ float: "left" }}
                type="button"
                onClick={this.buyTokens}
                variant="light"
              >
                Buy Tokens{" "}
              </Button>
              <Button variant="light" style={{ float: "right" }}>
                {" "}
                Sell Tokens
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default HomePage;
