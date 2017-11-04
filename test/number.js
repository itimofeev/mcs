const Number = artifacts.require('./Number.sol');

const szabo = 1000000000000;
const finney = 1000 * szabo;

function getBalance(account, at) {
  return web3.eth.getBalance(account, at).toNumber();
}

function advTime(seconds) {
  web3.currentProvider.send({ jsonrpc: "2.0", method: "evm_increaseTime", params: [seconds], id: 0 });
}

contract('Number', accounts => {
  it('Should be deployed', async () => {
    assert(await Number.deployed());
  });

  describe('Number interaction', async () => {
    let numberInstance;
    beforeEach(async () => {
      numberInstance = await Number.deployed();
      await advTime(10 * 60);
    });

    it('Should set number', async () => {
      assert((await numberInstance.getNumber()).toNumber() === 0);

      assert(await numberInstance.setNumber(777, { value: finney }));

      assert((await numberInstance.getNumber()).toNumber() === 777);
    });

    it('Should fail if not enough value sent', async () => {
      try {
        await numberInstance.setNumber(777, { value: szabo });
      } catch (e) {
        return true;
      }
      throw new Error("I should never see this!")
    });

    it('Should send money to owner', async () => {
      const originalBalance0 = await getBalance(accounts[0]);
      const originalBalance1 = await getBalance(accounts[1]);

      assert(await numberInstance.setNumber(777, { from: accounts[1], value: 2 * finney }));

      const finalBalance0 = await getBalance(accounts[0]);
      const finalBalance1 = await getBalance(accounts[1]);

      assert(originalBalance0 + 2 * finney === finalBalance0);
      assert(finalBalance1 < originalBalance1 - 2 * finney);// < instead = because we spent some gas
    });

    it('Should reserve message to 10 minutes', async () => {
      assert(await numberInstance.setNumber(777, { from: accounts[1], value: 2 * finney }));

      try {
        await numberInstance.setNumber(777, { from: accounts[1], value: 2 * finney })
      } catch (e) {
        // it's ok because we try to set number before reserve time passed
      }

      advTime(10 * 60);

      await numberInstance.setNumber(888, { from: accounts[1], value: 2 * finney });
      assert((await numberInstance.getNumber()).toNumber() === 888);
    })
  })
});