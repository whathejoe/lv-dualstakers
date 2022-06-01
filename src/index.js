require('dotenv').config();
require('colors');
const Table = require('cli-table');
const provider = require('./provider');
const { getStats: getLvStats } = require('./statFns/llamaverse');
const { getStats: getBoostStats } = require('./statFns/boost');

const main = async () => {
  const latestBlock = await provider.getBlockNumber();
  const lvStats = await getLvStats(latestBlock);
  const boostStats = await getBoostStats(latestBlock);

  const mergedTable = new Table({
    head: ['', 'Animated'.yellow, 'Gold Boost'.yellow],
  });

  mergedTable.push(
    ['Community', lvStats.community, boostStats.community],
    ['Dev wallet', lvStats.devWallet, boostStats.devWallet],
    ['Total staked', lvStats.total, boostStats.total]
  );

  console.log(`Block:`, latestBlock);
  console.log(mergedTable.toString());

  const lvStakers = Object.keys(lvStats.stakers);
  const boostStakers = Object.keys(boostStats.stakers);

  const dualStakers = [];

  lvStakers.forEach((address) => {
    if (boostStakers.indexOf(address) === -1) return;

    dualStakers.push(address);
  });

  // console.log("Eligible addresses:", dualStakers.length);
  console.log(
    'Address staking both Animated & Gold Boost:',
    dualStakers.length
  );

  console.log('\n');
};

main();
