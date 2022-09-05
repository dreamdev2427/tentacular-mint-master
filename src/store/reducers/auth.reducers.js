import { UPDATE_WEB3, SET_WALLET_ADDR, UPDATE_USER_BALANCE, SET_CHAIN_ID, UPDATE_USER_NFTS } from "../actions/action.types";

const auth = {
    currentWallet: "",
    currentChainId: "",
    balance: 0,
    globalWeb3: {},
    nfts: [],
}

export function Auth(state = auth, action) 
{
    switch (action.type) {
        case UPDATE_USER_NFTS:
            return {
                ...state, nfts: action.payload
            }
        case UPDATE_WEB3:
            return {
                ...state, globalWeb3: action.payload
            }
        case SET_WALLET_ADDR:
            return {
                ...state, currentWallet: action.payload
            }
        case SET_CHAIN_ID:
            return {
                ...state, currentChainId: action.payload
            }
        case UPDATE_USER_BALANCE:            
            return { ...state, balance: action.payload };
        default:
            return { ...state };
    }
}

export function getGlobalWeb3(state){
    return state.auth.globalWeb3;
}