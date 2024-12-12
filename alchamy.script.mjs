import { Network, Alchemy } from 'alchemy-sdk';

const settings = {
    apiKey: "oVrdY4cuBE39fJoFLs1_t2Z3u4nlZpOk",
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

// get the latest block
const latestBlock = alchemy.core.getBlock("latest").then(console.log);