const { addresses } = require("./constants");
const { contracts } = require("./contracts");

const llamaverseStakeFilter = contracts.llamaverse.filters.Transfer(
  null,
  addresses.zoo
);

const llamaverseUnstakeFilter = contracts.llamaverse.filters.Transfer(
  addresses.zoo,
  null
);

const llamaverse = {
  stake: llamaverseStakeFilter,
  unstake: llamaverseUnstakeFilter,
};

module.exports = {
  filters: {
    llamaverse,
  },
};
