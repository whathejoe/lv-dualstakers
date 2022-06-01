const { ethers } = require("ethers");
const { abis } = require("../abi");
const { addresses } = require("./constants");
const provider = require("./provider");

const llamaverseContract = new ethers.Contract(
  addresses.llamaverse,
  abis.llamaverse,
  provider
);

const boostContract = new ethers.Contract(
  addresses.boost,
  abis.boost,
  provider
);

const zooContract = new ethers.Contract(addresses.zoo, abis.zoo, provider);

const contracts = {
  llamaverse: llamaverseContract,
  boost: boostContract,
  zoo: zooContract,
};

module.exports = {
  contracts,
};
