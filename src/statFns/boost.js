const { addresses } = require('../constants');
const { contracts } = require('../contracts');

const filterBoostStake = contracts.boost.filters.TransferSingle(
  null,
  null,
  addresses.zoo
);

const filterBoostUnstake = contracts.boost.filters.TransferSingle(
  null,
  addresses.zoo
);

const getStats = async (latestBlock) => {
  const stakeTransfers = await contracts.boost.queryFilter(
    filterBoostStake,
    'earliest',
    latestBlock
  );
  const unstakeTransfers = await contracts.boost.queryFilter(
    filterBoostUnstake,
    'earliest',
    latestBlock
  );

  const stakers = {};
  let totalStaked = 0;
  let devWallet = 0;

  stakeTransfers.forEach(({ args: [, owner, , bigTokenId, bigAmount] }) => {
    const tokenId = bigTokenId.toNumber();
    const amount = bigAmount.toNumber();

    if (tokenId !== 1 || amount === 0) return;

    if (owner === addresses.devWallet) devWallet += amount;

    if (owner in stakers) {
      stakers[owner] += amount;
    } else {
      stakers[owner] = amount;
    }

    totalStaked += amount;
  });

  unstakeTransfers.forEach(({ args: [, , owner, bigTokenId, bigAmount] }) => {
    const tokenId = bigTokenId.toNumber();
    const amount = bigAmount.toNumber();

    if (tokenId !== 1 || amount === 0) return;

    if (owner === addresses.devWallet) devWallet -= amount;

    stakers[owner] -= amount;
    totalStaked -= amount;

    if (stakers[owner] === 0) delete stakers[owner];
  });

  //   console.log(stakers);
  //   console.log(totalStaked);
  //   console.log(devWallet);

  return {
    total: totalStaked,
    community: totalStaked - devWallet,
    devWallet: devWallet,
    stakers,
  };
};

module.exports = { getStats };
