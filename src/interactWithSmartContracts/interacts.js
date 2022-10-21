import axios from "axios";
import { BACKEND_URL, ETHEREUM_RPC_URL, MAIN_TOKEN_ADDRESS, SALE_CONTRACT_ADDRESS, POLYGON_RPC_URL } from "../env";
import { store } from "../store";
import Web3 from "web3";
import { updateNFTsOfUser } from "../store/actions/auth.actions";
import BigNumber from "big-number";
import  { MerkleTree } from 'merkletreejs';
import keccak  from 'keccak256';
const readLine = require('readline');
const fs = require('fs');
const maintokenABI = require("../interactWithSmartContracts/mainToken.json");
const saleContractABI = require("../interactWithSmartContracts/saleContract.json");

export const unbound = async (globalWeb3, accountStr, tokenIds) => {
	let maintokenContract;
	try {
		maintokenContract = new globalWeb3.eth.Contract(maintokenABI, MAIN_TOKEN_ADDRESS);
	}
	catch (error) {
		return {
			success: false,
			value: 0,
			message: "Contract instance creation is failed"
		}
	}
	try {
		let token_Ids = [];
		for (let idx = 0; idx < tokenIds.length; idx++) token_Ids[idx] = globalWeb3.utils.toBN(tokenIds[idx]);
		let funcTrx = maintokenContract.methods.unbound(token_Ids);
		await funcTrx.estimateGas({
			from: accountStr
		});
		await funcTrx.send({
			from: accountStr,
			gasPrice: 10 * (10 ** 9)
		})
		return {
			success: true,
			value: []
		};
	}
	catch (error) {
		return {
			success: false,
			value: 0,
			message: error.message
		}
	}
}

export const bound = async (globalWeb3, accountStr, tokenId) => {
	let maintokenContract;
	try {
		maintokenContract = new globalWeb3.eth.Contract(maintokenABI, MAIN_TOKEN_ADDRESS);
	}
	catch (error) {
		return {
			success: false,
			value: 0,
			message: "Contract instance creation is failed"
		}
	}
	try {
		let funcTrx = maintokenContract.methods.bound([globalWeb3.utils.toBN(tokenId)]);
		await funcTrx.estimateGas({
			from: accountStr
		});
		await funcTrx.send({
			from: accountStr,
			gasPrice: 10 * (10 ** 9)
		})
		return {
			success: true,
			value: []
		};
	}
	catch (error) {
		return {
			success: false,
			value: 0,
			message: error.message
		}
	}
}

export const doPublicMint = async (globalWeb3, accountStr, numberOfNFTs, salePrice) => {
	let publicSaleContract;
	try {
		publicSaleContract = new globalWeb3.eth.Contract(saleContractABI, SALE_CONTRACT_ADDRESS);
	}
	catch (error) {
		return {
			success: false,
			value: 0,
			message: "Contract instance creation is failed"
		}
	}
	// let numberOfMinting = globalWeb3.utils.toWei(numberOfNFTs.toString(), "ether");
	console.log("numberOfNFTs = ", numberOfNFTs, " salePrice = ", salePrice );
	try 
	{
		let funcTrx = publicSaleContract.methods.publicSale(numberOfNFTs);
		let nativeValue = globalWeb3.utils.toWei((Number(numberOfNFTs)*Number(salePrice)).toString(), "ether");
		await funcTrx.estimateGas({
			from: accountStr,
			value: nativeValue.toString()
		});
		await funcTrx.send({
			from: accountStr,
			gasPrice: 10 * (10 ** 9),			
			value: nativeValue.toString()
		})
		return {
			success: true,
			value: []
		};
	}
	catch (error) {
		return {
			success: false,
			value: 0,
			message: error.message.toString()
		}
	}
}

export const getSoldTotal = async (globalWeb3) => {
	let maintokenContract, value = 0;
	try {
		maintokenContract = new globalWeb3.eth.Contract(saleContractABI, SALE_CONTRACT_ADDRESS);
	}
	catch (error) {
		return {
			success: false,
			value: 0,
			message: "Contract instance creation is failed"
		}
	}
	try {
		value = await maintokenContract.methods.soldTotal().call();
	}
	catch (error) {
		return {
			success: false,
			value: 0,
			message: error.message.toString()
		}
	}
	return {
		success: true,
		value
	};
}

export const getPublicSalePrice = async (globalWeb3) => {
	let maintokenContract;
	try {
		maintokenContract = new globalWeb3.eth.Contract(saleContractABI, SALE_CONTRACT_ADDRESS);
	}
	catch (error) {
		return {
			success: false,
			value: 0,
			message: "Contract instance creation is failed"
		}
	}
	try {
		let value = await maintokenContract.methods.publicSalePrice().call();
		value = globalWeb3.utils.fromWei(value.toString(), "ether");
		return {
			success: true,
			value: Number(value.toString())
		};
	}
	catch (error) {
		return {
			success: false,
			value: 0,
			message: error.message.toString()
		}
	}
}

export const isInALWL = async (globalWeb3, testingAddress) => {
	let publicSaleContract;
	try {
		publicSaleContract = new globalWeb3.eth.Contract(saleContractABI, SALE_CONTRACT_ADDRESS);
		
	console.log("bbbbb "); 
	}
	catch (error) {
		return {
			success: false,
			value: false,
			message: "Contract instance creation is failed"
		}
	}
	let isIn = false;
	console.log("eeeeeeeee "); 
	try{
		// Create AL root
		
		console.log("sssssssssss "); 
		let al_leaves = [];
		var rl = readLine.createInterface({
			input : fs.createReadStream('./al.txt'),
			output : process.stdout,
			terminal: false
		});
		rl.on('line', function (text) {
		 console.log(text);
		 al_leaves.push(text);
		});
		// al_leaves = fs.readFileSync('./al.txt', 'utf-8');
		// console.log("al_leaves =   ", al_leaves);   
		// al_leaves = al_leaves.split(/\r?\n/);        // read file with a wallets list (1 per line)
		
		console.log("al_leaves =   ", al_leaves);    
		al_leaves = al_leaves.map(x => keccak(x))     
		console.log("al_leaves =   ", al_leaves);                                                      
		const al_tree = new MerkleTree(al_leaves, keccak, { sortPairs: true })      // { sortPairs: true } should be set! In other case contract merke library will not be able to check it in correct way
		console.log("al_tree =   ", al_tree);
		let al_leaf = keccak(testingAddress)              // generate keccak from wallet we want to check
		let al_proof=al_tree.getHexProof(al_leaf)                                       // get proof for the leaf                     // returns true or false

		//////// To check if wallet is in whitelist on the contract side:
		isIn = await publicSaleContract.methods.isInALMerkleTree(testingAddress, al_proof).call(); // please note that you should call it with wallet address, not keccak(wallet), use isInFreeMerkleTree to check the free mint list instead
		console.log("aaaaaaaaa  isIn = ", isIn);
		return {
			success: true,
			value: isIn,
			message: ""
		}
	}catch(err) {
		return {
			success: false,
			value: false,
			message: "Calling isInALMerkleTree() cause error "+err
		}
	}
}

export const getAlSalePrice = async (globalWeb3) => {
	let maintokenContract;
	try {
		maintokenContract = new globalWeb3.eth.Contract(saleContractABI, SALE_CONTRACT_ADDRESS);
	}
	catch (error) {
		return {
			success: false,
			value: 0,
			message: "Contract instance creation is failed"
		}
	}
	try {
		let value = await maintokenContract.methods.alSalePrice().call();
		return {
			success: true,
			value
		};
	}
	catch (error) {
		return {
			success: false,
			value: 0,
			message: error.message.toString()
		}
	}
}

export const getAlDayOneSalePrice = async (globalWeb3) => {
	let maintokenContract;
	try {
		maintokenContract = new globalWeb3.eth.Contract(saleContractABI, SALE_CONTRACT_ADDRESS);
	}
	catch (error) {
		return {
			success: false,
			value: 0,
			message: "Contract instance creation is failed"
		}
	}
	try {
		let value = await maintokenContract.methods.alDayOneSalePrice().call();
		return {
			success: true,
			value
		};
	}
	catch (error) {
		return {
			success: false,
			value: 0,
			message: error.message.toString()
		}
	}
}

export const getMaxPerWallet = async (globalWeb3) => {
	let maintokenContract;
	try {
		maintokenContract = new globalWeb3.eth.Contract(saleContractABI, SALE_CONTRACT_ADDRESS);
	}
	catch (error) {
		return {
			success: false,
			value: 0,
			message: "Contract instance creation is failed"
		}
	}
	try {
		let value = await maintokenContract.methods.maxPerWallet().call();
		return {
			success: true,
			value
		};
	}
	catch (error) {
		return {
			success: false,
			value: 0,
			message: error.message.toString()
		}
	}
}

export const getRecentWinners = async (limit=7) => {	
	let entries = [];
	await axios({
		method: "post",
		url: `${BACKEND_URL}/api/Winning/recentWinners`,
		data: {
			limit
		}
	}).then((res) => {
		console.log("[interact.js getRecentWinners()] res = ", res);		
		if(res.status === 200) 
		{
			entries = res.data.data || [];
		}
	})
	.catch((error) => {
		return {
			success: false,
			value: [],
			message: error.message
		}
	});
	return {
		success: true,
		value: entries,
	}
}
