export const BACKEND_URL = "https://berryjuicer.com";

const ETHEREUM_RPC_URL = "https://nd-061-599-676.p2pify.com/30f7f6297152feda1c8fde33932ea239";
//Goerli  https://nd-061-599-676.p2pify.com/30f7f6297152feda1c8fde33932ea239
//main https://mainnet.infura.io/v3/

const ETHEREUM_CHAIN_ID = 5;
//Goerli 5 0x5
//MAIN 1 0x1

const POLYGON_RPC_URL = "https://nd-919-882-597.p2pify.com/b954e1d27ce8e0a24312ee4b1c5348ec";
//mumbai https://nd-919-882-597.p2pify.com/b954e1d27ce8e0a24312ee4b1c5348ec
//main https://polygon-rpc.com

const POLYGON_CHAIN_ID = 80001;
//Mumbai 80001 0x13881
//main 137 0x89

export const MAIN_TOKEN_ADDRESS = "0xa38a5f4E3cE1d3Fef0cd6a91Ef8e0415dee20dA1"; //Tentacular token on Ethereum
//test 0xa38a5f4E3cE1d3Fef0cd6a91Ef8e0415dee20dA1 
//main 

export const SALE_CONTRACT_ADDRESS = "0x8786914e9129DC0C028fd5695800175669001D0F"; //Sale smart contract for Tentacular on Ethereum
//test 0x8786914e9129DC0C028fd5695800175669001D0F
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
