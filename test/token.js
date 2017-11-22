const Token = artifacts.require('./MyToken.sol');

contract('Token', accounts => {

  describe('Token interaction', async () => {
    let tokenInstance;
    beforeEach(async () => tokenInstance = await Token.deployed());

    it('Should check initial balance', async () => {
      assert((await tokenInstance.balanceOf(accounts[0])).toNumber() === 10000)
    });

    it('Should transfer tokens', async () => {
      const transferWatcher = tokenInstance.Transfer();

      assert((await tokenInstance.balanceOf(accounts[0])).toNumber() === 10000);

      await tokenInstance.transfer(accounts[1], 100);

      assert((await tokenInstance.balanceOf(accounts[0])).toNumber() === 10000 - 100);
      assert((await tokenInstance.balanceOf(accounts[1])).toNumber() === 100);

      const events = transferWatcher.get();

      assert(events.length === 1);
      assert(events[0].args.from === accounts[0]);
      assert(events[0].args.to === accounts[1]);
      assert(events[0].args.value.toNumber() === 100);
    });
  })
});