const Token = artifacts.require('./MyToken.sol');
const Ownable = artifacts.require('./Ownable.sol');

contract('Token', accounts => {

  describe('Token interaction', async () => {
    let ownableInstance;
    beforeEach(async () => ownableInstance = await Ownable.deployed());

    it('Should check owner', async () => {
      assert(await ownableInstance.owner() === accounts[0]);

      await ownableInstance.transferOwner(accounts[1]);

      assert(await ownableInstance.owner() === accounts[1]);

      try {
        await ownableInstance.transferOwner(accounts[1], { from: accounts[2] });
      } catch (e) {
        return true;
      }
      throw new Error("I should never see this!")
    });
  })
});