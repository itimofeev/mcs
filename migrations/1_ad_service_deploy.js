var Ad = artifacts.require("./AdService.sol");

module.exports = function(deployer) {
  deployer.deploy(Ad);
};
