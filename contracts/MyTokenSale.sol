pragma solidity ^0.6.2;
import "./Crowdsale.sol";
import "./KYCContract.sol";
contract MyTokenSale is Crowdsale {

    KYCContract kyc;
    constructor(
        uint256 rate,    // rate in TKNbits
        address payable wallet,
        IERC20 token,
        KYCContract _kyc
    )
        Crowdsale(rate, wallet, token)
        public
    {
        kyc = _kyc;
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override {
       super._preValidatePurchase(beneficiary, weiAmount);
        require(kyc.kycCompleted(msg.sender),"KYC Not Completed. Transaction now allowed");
    }
}