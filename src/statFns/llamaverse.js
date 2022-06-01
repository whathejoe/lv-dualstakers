const { addresses } = require("../constants");
const { contracts } = require("../contracts");
const { filters } = require("../filters");

const getStats = async (latestBlock) => {
  const stakeTransfers = await contracts.llamaverse.queryFilter(
    filters.llamaverse.stake,
    "earliest",
    latestBlock
  );

  const unstakeTransfers = await contracts.llamaverse.queryFilter(
    filters.llamaverse.unstake,
    "earliest",
    latestBlock
  );

  const stakers = {};
  let totalStaked = 0;
  let devWallet = [];

  stakeTransfers.forEach(({ args: [owner, , tokenId] }) => {
    if (tokenId >= 500) return;

    if (owner === addresses.devWallet) devWallet.push(tokenId.toNumber());

    if (owner in stakers) {
      stakers[owner]++;
    } else {
      stakers[owner] = 1;
    }

    totalStaked++;
  });

  unstakeTransfers.forEach(({ args: [, owner, tokenId] }) => {
    if (tokenId >= 500) return;

    if (owner === addresses.devWallet) {
      const idx = devWallet.indexOf(tokenId.toNumber());
      devWallet.splice(idx, 1);
    }

    stakers[owner]--;
    totalStaked--;

    if (stakers[owner] === 0) delete stakers[owner];
  });

  return {
    total: totalStaked,
    community: totalStaked - devWallet.length,
    devWallet: devWallet.length,
    stakers,
  };
};

module.exports = { getStats };
