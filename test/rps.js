const RPS = artifacts.require("RPS");

contract("RPS", (accounts) => {
  const [creator, participant] = accounts;
  const BET_AMOUNT = web3.utils.toWei("0.1", "ether");
  const SALT = 12345;

  let rpsInstance;
  let gameId;

  beforeEach(async () => {
    rpsInstance = await RPS.new({from: accounts[0]});
  });

  it("Should NOT ")

});
