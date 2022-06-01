const { ethers } = require('ethers');

const network = 'homestead';
const provider = new ethers.providers.InfuraProvider(network, {
  infura: {
    projectId: process.env.INFURA_PROJECT_ID,
    projectSecret: process.env.INFURA_PROJECT_SECRET,
  },
});

module.exports = provider;
