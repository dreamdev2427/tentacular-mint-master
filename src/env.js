export const BACKEND_URL = "https://berryjuicer.com";

export const ETHEREUM_RPC_URL = "https://nd-264-440-618.p2pify.com/dfea93c53f746df50abf978de2e2e7ad";
//Goerli  https://nd-264-440-618.p2pify.com/dfea93c53f746df50abf978de2e2e7ad
//main https://mainnet.infura.io/v3/

export const ETHEREUM_CHAIN_ID = 5;
//Goerli 5 0x5
//MAIN 1 0x1

export const POLYGON_RPC_URL = "https://nd-129-163-341.p2pify.com/155790d84cb60622110199d880d46d08";
//mumbai https://nd-129-163-341.p2pify.com/155790d84cb60622110199d880d46d08
//main https://polygon-rpc.com

export const POLYGON_CHAIN_ID = 80001;
//Mumbai 80001 0x13881
//main 137 0x89

export const MAIN_TOKEN_ADDRESS = "0xa38a5f4E3cE1d3Fef0cd6a91Ef8e0415dee20dA1"; //Tentacular token on Ethereum
//test 0xa38a5f4E3cE1d3Fef0cd6a91Ef8e0415dee20dA1 
//main 

export const SALE_CONTRACT_ADDRESS = "0x2B18e26d256BC89668cf98157C88A9EF196Be200"; //Sale smart contract for Tentacular on Ethereum
//test 0x2B18e26d256BC89668cf98157C88A9EF196Be200
//main 

/*---------------------------------------------
///////////////////////////////////////////////

functions:
public sale - function publicSale(uint count)
allow list sale - function alSale(uint count, bytes32[] calldata proof)
allow list day one sale - function alDayOneSale(uint count, bytes32[] calldata proof)

values:
uint public soldTotal;
uint public publicSalePrice;
uint public alSalePrice;
uint public alDayOneSalePrice;
uint public maxPerWallet;

////////////////////////////////////////////////////
---------------------------------------------- */
