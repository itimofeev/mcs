const Token = artifacts.require("./MyToken.sol");
const Ownable = artifacts.require("./Ownable.sol");

module.exports = function(deployer) {
  deployer.deploy(Ownable);
  deployer.deploy(Token);
};
