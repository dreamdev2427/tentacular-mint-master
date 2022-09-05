import { SET_CHAIN_ID, UPDATE_WEB3, UPDATE_USER_BALANCE, SET_WALLET_ADDR, UPDATE_USER_NFTS } from "./action.types"

export const updateNFTsOfUser = (list) => dispatch => {
    dispatch({
        type: UPDATE_USER_NFTS,
        payload: list
    })
}

export const setConnectedWalletAddress = (address) => dispatch => {
    dispatch({
        type: SET_WALLET_ADDR,
        payload: address
    })
}

export const setConnectedChainId = (chainId) => dispatch => {
    dispatch({
        type: SET_CHAIN_ID,
        payload: chainId
    })
}

export const updateBalanceOfUser =  (balance) => dispatch =>
{
    //UPDATE_USER_BALANCE
    dispatch({
        type: UPDATE_USER_BALANCE,
        payload: balance
    })
}

export const updateGlobalWeb3 = (object) => dispatch => {
    dispatch({
        type: UPDATE_WEB3,
        payload: object
    })
}
