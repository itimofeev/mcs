const Number = artifacts.require('./Number.sol');

const finney = 1000000000000000;
const szabo = 1000000000000;

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
    })
  })
});