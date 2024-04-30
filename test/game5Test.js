const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Game5", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();

    const signer = ethers.provider.getSigner(13);

    return { game, signer };
  }
  it("should be a winner", async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    // good luck
    const checkSumAddress = ethers.utils.getAddress(
      "0x0000000000000000000000000000000000000001"
    );

    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [checkSumAddress],
    });

    await hre.network.provider.send("hardhat_setBalance", [
      checkSumAddress,
      "0xFFFFFFFFFFFFFFFFFFFFFFFF",
    ]);

    const signer = await ethers.getSigner(checkSumAddress);

    await game.connect(signer).win();

    await hre.network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [checkSumAddress],
    });

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
