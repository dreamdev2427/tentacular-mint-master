import axios from "axios";
import { BACKEND_URL, ETHEREUM_RPC_URL, MAIN_TOKEN_ADDRESS, SALE_CONTRACT_ADDRESS, POLYGON_RPC_URL } from "../env";
import { store } from "../store";
import Web3 from "web3";
import { updateNFTsOfUser } from "../store/actions/auth.actions";
import BigNumber from "big-number";
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

export const doPublicMint = async (globalWeb3, accountStr, numberOfNFTs) => {
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
	// console.log("numberOfMinting = ", numberOfMinting );
	try {
		let funcTrx = publicSaleContract.methods.publicSale(numberOfNFTs);
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
