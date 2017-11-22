const Ad = artifacts.require('./AdService.sol');

const szabo = 1000000000000;
const finney = 1000 * szabo;

function getBalance(account, at) {
  return web3.eth.getBalance(account, at).toNumber();
}

function advTime(seconds) {
  web3.currentProvider.send({ jsonrpc: "2.0", method: "evm_increaseTime", params: [seconds], id: 0 });
  // web3.currentProvider.send({ jsonrpc: "2.0", method: "evm_mine", params: [], id: 0 })
}

contract('Ad', accounts => {
  it('Should be deployed', async () => {
    assert(await Ad.deployed());
  });

  describe('Ad interaction', async () => {
    let adInstance;
    beforeEach(async () => {
      adInstance = await Ad.deployed();
      await advTime(10 * 60);
    });

    it('Should set ad', async () => {
      assert.strictEqual(await adInstance.getAd(), "");

      await adInstance.publishAd("take part in ICO", { value: finney });

      assert.strictEqual(await adInstance.getAd(), "take part in ICO");
    });

    it('Should fail if not enough value sent', async () => {
      try {
        await adInstance.publishAd("take part in ICO", { value: szabo });
      } catch (e) {
        return true;
      }
      throw new Error("I should never see this!")
    });

    it('Should send money to owner', async () => {
      const originalBalance0 = await getBalance(accounts[0]);
      const originalBalance1 = await getBalance(accounts[1]);
      const price = (await adInstance.getPrice()).toNumber();

      await adInstance.publishAd("take part in ICO", { from: accounts[1], value: 2 * price });

      const finalBalance0 = await getBalance(accounts[0]);
      const finalBalance1 = await getBalance(accounts[1]);

      assert.strictEqual(originalBalance0 + price, finalBalance0);
      assert.isBelow(finalBalance1, originalBalance1 - price);// not strict equal because of tx fee
    });

    it('Should reserve message to 10 minutes', async () => {
      await adInstance.publishAd("take part in ICO", { from: accounts[1], value: 2 * finney });

      try {
        await adInstance.publishAd("take part in ICO", { from: accounts[1], value: 2 * finney })
      } catch (e) {
        // it's ok because we try to set ad before reserve time passed
      }

      advTime(10 * 60);

      await adInstance.publishAd("PreICO", { from: accounts[1], value: 2 * finney });
      assert.strictEqual(await adInstance.getAd(), "PreICO");
    });

    it('Shoud fire event when ad publisged', async () => {
      const adWatcher = adInstance.AdPublished()

      await adInstance.publishAd("event should be fired", { from: accounts[1], value: finney });

      const events = adWatcher.get();

      assert.lengthOf(events, 1);
      assert.strictEqual(events[0].args.sender, accounts[1])
      assert.strictEqual(events[0].args.ad, "event should be fired")
    })
  })
});