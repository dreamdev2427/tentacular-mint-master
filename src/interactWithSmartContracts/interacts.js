import axios from "axios";
import { BACKEND_URL, ETHEREUM_RPC_URL, MAIN_TOKEN_ADDRESS, SALE_CONTRACT_ADDRESS, POLYGON_RPC_URL } from "../env";
import { store } from "../store";
import Web3 from "web3";
import { updateNFTsOfUser } from "../store/actions/auth.actions";
import BigNumber from "big-number";
import  { MerkleTree } from 'merkletreejs';
import keccak  from 'keccak256';
const fs = require('fs');
const maintokenABI = require("../interactWithSmartContracts/mainToken.json");
const saleContractABI = require("../interactWithSmartContracts/saleContract.json");
const ethWeb3 = new Web3(ETHEREUM_RPC_URL);

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
	let saleContract;
	try {
		saleContract = new globalWeb3.eth.Contract(saleContractABI, SALE_CONTRACT_ADDRESS);
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
		let funcTrx = saleContract.methods.publicSale(numberOfNFTs);
		let gasFee = await funcTrx.estimateGas({ from: accountStr });
		gasFee = gasFee * 5;
		let gasPrice = (await getCurrentGasPrices()).high;
		let nativeValue = globalWeb3.utils.toWei((Number(numberOfNFTs)*Number(salePrice)).toString(), "ether");		
		await funcTrx.send({
			from: accountStr,
			gas: gasFee,
			gasPrice: gasPrice,			
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
const GAS_STATION = 'https://ethgasstation.info/json/ethgasAPI.json'

async function getCurrentGasPrices() {
	try {
	  var response = await axios.get(GAS_STATION);
	  var prices = {
		low: response.data.safeLow ,
		medium: response.data.average ,
		high: response.data.fast,
	  };
	   let log_str =
		"High: " +
		prices.high +
		"        medium: " +
		prices.medium +
		"        low: " +
		prices.low;
		 console.log(log_str);
	  return prices;
	} catch (error) {
	  throw error;
	}
  }

export const doALSale = async (globalWeb3, accountStr, numberOfNFTs, salePrice) => {
	let saleContract;
	try {
		saleContract = new globalWeb3.eth.Contract(saleContractABI, SALE_CONTRACT_ADDRESS);
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
		let al_leaves = "";
		await fetch('/al.txt')
		.then((r) => r.text())
		.then(text  => {
			al_leaves = text;
		})  
		// console.log("al_leaves =   ", al_leaves);   
		al_leaves = al_leaves.split(/\r?\n/);      		
		// console.log("al_leaves =   ", al_leaves);    
		al_leaves = al_leaves.map(x => keccak(x))     
		// console.log("al_leaves =   ", al_leaves);                                                      
		const al_tree = new MerkleTree(al_leaves, keccak, { sortPairs: true })     
		// console.log("al_tree =   ", al_tree);
		let al_leaf = keccak(accountStr);             
		let al_proof=al_tree.getHexProof(al_leaf);       
		let funcTrx = saleContract.methods.alSale(numberOfNFTs, al_proof);
		let gasFee = await funcTrx.estimateGas({ from: accountStr });
		gasFee = gasFee * 5;
		let gasPrice = (await getCurrentGasPrices()).high;
		let nativeValue = globalWeb3.utils.toWei((Number(numberOfNFTs)*Number(salePrice)).toString(), "ether");		
		await funcTrx.send({
			from: accountStr,
			gas: gasFee,
			gasPrice: gasPrice,			
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

export const doFreemint = async (globalWeb3, accountStr) => {
	let saleContract;
	try {
		saleContract = new globalWeb3.eth.Contract(saleContractABI, SALE_CONTRACT_ADDRESS);
	}
	catch (error) {
		return {
			success: false,
			value: 0,
			message: "Contract instance creation is failed"
		}
	}
	try 
	{
		let al_leaves = "";
		await fetch('/fl.txt')
		.then((r) => r.text())
		.then(text  => {
			al_leaves = text;
		})    
		al_leaves = al_leaves.split(/\r?\n/);       		  
		al_leaves = al_leaves.map(x => keccak(x))                                                         
		const al_tree = new MerkleTree(al_leaves, keccak, { sortPairs: true })     
		let al_leaf = keccak(accountStr);             
		let al_proof=al_tree.getHexProof(al_leaf);    
		let funcTrx = saleContract.methods.freeMint(al_proof);
		let gasFee = await funcTrx.estimateGas({ from: accountStr });
		gasFee = gasFee * 5;
		let gasPrice = (await getCurrentGasPrices()).high;
		await funcTrx.send({
			from: accountStr,
			gas: gasFee,
			gasPrice: gasPrice,			
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
		value = await maintokenContract.methods.totalSupply().call();		
		console.log(value)	
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
		maintokenContract = new ethWeb3.eth.Contract(saleContractABI, SALE_CONTRACT_ADDRESS);
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
		value = ethWeb3.utils.fromWei(value.toString(), "ether");
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
	let saleContract;
	try {
		saleContract = new globalWeb3.eth.Contract(saleContractABI, SALE_CONTRACT_ADDRESS);		
	}
	catch (error) {
		return {
			success: false,
			value: false,
			message: "Contract instance creation is failed"
		}
	}
	let isIn = false;
	try{
		// Create AL root		
		let al_leaves = "";
		await fetch('/al.txt')
		.then((r) => r.text())
		.then(text  => {
			al_leaves = text;
		})  
		// console.log("al_leaves =   ", al_leaves);   
		al_leaves = al_leaves.split(/\r?\n/);      		
		// console.log("al_leaves =   ", al_leaves);    
		al_leaves = al_leaves.map(x => keccak(x))     
		// console.log("al_leaves =   ", al_leaves);                                                      
		const al_tree = new MerkleTree(al_leaves, keccak, { sortPairs: true })     
		// console.log("al_tree =   ", al_tree);
		let al_leaf = keccak(testingAddress);             
		let al_proof=al_tree.getHexProof(al_leaf);                                       
		let al_root = al_tree.getRoot().toString('hex')
		//////// To check if wallet is in whitelist on the contract side:
		isIn = await saleContract.methods.isInALMerkleTree(testingAddress, al_proof).call(); 
		console.log("aaaaaaaaa  isIn = ", isIn, "al_root = ", al_root);
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

export const isInFLWL = async (globalWeb3, testingAddress) => {
	let saleContract;
	try {
		saleContract = new globalWeb3.eth.Contract(saleContractABI, SALE_CONTRACT_ADDRESS);		
	}
	catch (error) {
		return {
			success: false,
			value: false,
			message: "Contract instance creation is failed"
		}
	}
	let isIn = false;
	try{
		// Create AL root		
		let al_leaves = "";
		await fetch('/fl.txt')
		.then((r) => r.text())
		.then(text  => {
			al_leaves = text;
		})    
		al_leaves = al_leaves.split(/\r?\n/);       		  
		al_leaves = al_leaves.map(x => keccak(x))                                                         
		const al_tree = new MerkleTree(al_leaves, keccak, { sortPairs: true })     
		let al_leaf = keccak(testingAddress);             
		let al_proof=al_tree.getHexProof(al_leaf);                                       
		let al_root = al_tree.getRoot().toString('hex')
		//////// To check if wallet is in whitelist on the contract side:
		isIn = await saleContract.methods.isInFreeMerkleTree(testingAddress, al_proof).call(); 
		console.log("cccccc  isIn = ", isIn, "fl_root = ", al_root);
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
		value = ethWeb3.utils.fromWei(value.toString(), "ether");
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

export const getMintedByWallet = async (globalWeb3, accountStr) => {
	let saleContract;
	try {
		saleContract = new globalWeb3.eth.Contract(saleContractABI, SALE_CONTRACT_ADDRESS);				
	}
	catch (error) {
		return {
			success: false,
			value: false,
			message: "Contract instance creation is failed"
		}
	}
	try {
		let value = await saleContract.methods.getMintedByWallet(accountStr).call();
		return {
			success: true,
			value
		};
	}
	catch (error) {
		return {
			success: false,
			value: {},
			message: error.message.toString()
		}
	}
}
