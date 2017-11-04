const Number = artifacts.require('./Number.sol');

const finney = 1000000000000000;
const szabo = 1000000000000;

function getBalance(account, at) {
  return web3.eth.getBalance(account, at).toNumber();
  // return web3.eth.getBalance(account, at);
}

contract('Number', accounts => {
  it('Should be deployed', async () => {
    assert(await Number.deployed())
  });

  describe('Number interaction', async () => {
    let numberInstance;
    beforeEach(async () => numberInstance = await Number.deployed());

    it('Should set number', async () => {
      assert((await numberInstance.number()).toNumber() === 0);

      assert(await numberInstance.setNumber(777, { value: finney }));

      assert((await numberInstance.number()).toNumber() === 777);
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
    })
  })
});