const MyToken = artifacts.require("MyToken");

var chai = require("chai");
const BN = web3.utils.BN;
const chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const expect = chai.expect;

contract("MyToken Test", async (accounts) => {
    const [deployerAccount, recipientAccount, anotherAccount] = accounts;

    it("All tokens should be in deployer account ", async () => {
        let instance = await MyToken.deployed();
        let totalSupply = await instance.totalSupply();

        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
    });

    it("It should be able to send tokens between accounts ", async () => {
        const sendToken = 1;
        let instance = await MyToken.deployed();
        let totalSupply = await instance.totalSupply();

        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        expect(instance.transfer(recipientAccount, sendToken)).to.eventually.be.fulfilled;
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendToken)));
        expect(instance.balanceOf(recipientAccount)).to.be.eventually.be.a.bignumber.equal(new BN(sendToken));
    });

    it("Its not possible to send more tokens than available", async () => {
        let instance = await MyToken.deployed();
        let balanceOfDeployer = await instance.balanceOf(deployerAccount);

        expect(instance.transfer(recipientAccount, balanceOfDeployer + 1)).to.eventually.be.rejected;
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
    });
});