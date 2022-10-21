import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NotificationManager } from "react-notifications";

import MainLayout from "../layouts/MainLayout";
import { getSoldTotal, getPublicSalePrice, getAlSalePrice, getAlDayOneSalePrice, getMaxPerWallet, doPublicMint, isInALWL } from "../interactWithSmartContracts/interacts";
import { ETHEREUM_CHAIN_ID } from "../env";

const Landing = () => {

  const globalAccount = useSelector((state) => state.auth.currentWallet);
  const globalWeb3 = useSelector((state) => state.auth.globalWeb3);
  const globalChainId = useSelector(state => state.auth.currentChainId);
  const dispatch = useDispatch();

  const [numberState, setNumberState] = useState(0);
  const [soldTotal, setSoldTotal] = useState(0);
  const [publicSalePrice, setPublicSalePrice] = useState(0);
  const [alSalePrice, setAlSalePrice] = useState(0);
  const [alDayOneSalePrice, setAlDayOneSalePrice] = useState(0);
  const [maxPerWallet, setMaxPerWallet] = useState(3);

  const fetchAllNecessaryValues  = async () => {      
      let promiseArr = [];
      promiseArr.push(getSoldTotal());
      promiseArr.push(getPublicSalePrice());
      promiseArr.push(getAlSalePrice());
      promiseArr.push(getAlDayOneSalePrice());
      promiseArr.push(getMaxPerWallet());
      Promise.all(promiseArr)
      .then((values) => {
        if(values[0].success === true) setSoldTotal(values[0].value);
        if(values[1].success === true) setPublicSalePrice(values[1].value);
        if(values[2].success === true) setAlSalePrice(values[2].value);
        if(values[3].success === true) setAlDayOneSalePrice(values[3].value);
        if(values[4].success === true) setMaxPerWallet(values[4].value);
      })
      .catch((error) => {

      })
  }
  
  useEffect(() => {
    if (globalAccount) {
      if(globalChainId !== ETHEREUM_CHAIN_ID) {      
        NotificationManager.warning("Please connect your wallet to Ethereum network and retry", 'Warning', 5000, () => {});
      }
      fetchAllNecessaryValues();
    }
  }, [globalAccount]);

  const changeNumber = (payload) => {
    return setNumberState((prevState) => {
      if (payload === "inc") {
        return prevState + 1;
      } else if (payload === "dec") {
        if (prevState < 1) {
          return 0;
        }
        return prevState - 1;
      }
    });
  };

  const onClickMint = async () => {
    if(globalAccount && globalWeb3)
    {
      if(globalChainId !== ETHEREUM_CHAIN_ID) {      
        NotificationManager.warning("Please connect your wallet to Ethereum network and retry", 'Warning', 5000, () => {});
        return;
      }
      if(numberState > maxPerWallet) {     
        NotificationManager.warning("You can not mint nore than "+maxPerWallet+" NFTs.", 'Warning', 5000, () => {});
        return;        
      }
      //verify lists    
      /* /////////
      getMintedByWallet(wallet) will return you uint[2]
      [0] - minted on public + minted on AL stage
      [1] - minted on free mint
      3 in total - max
      ///////// */
      try{
        let returnObject = {}; 
        returnObject = await  isInALWL(globalWeb3, globalAccount);
        if(returnObject.success == true && returnObject.value == true ) { 
          returnObject = await doPublicMint(globalWeb3, globalAccount, numberState, publicSalePrice);
          if(returnObject.success === true) { 
            NotificationManager.success("You 've successfully minted some NFTs.", 'Success', 10000, updateTotal() );
            setTimeout( () => { 
              updateTotal();
            }, 10000);
          }else{
            NotificationManager.warning(returnObject.message, 'Error', 10000, async () => {      
            });
          }
        }else{
          NotificationManager.warning(returnObject.message, 'Error', 10000, async () => {      
          });
        }
      }catch(err){
        alert(err);
      }
    }
  }

  const updateTotal = async () => {        
    let newTotal = await getSoldTotal(globalWeb3);
    if(newTotal.success === true) setSoldTotal(newTotal.value);
  }

  return (
    <MainLayout>
      <div className="section" id="main">
        <div className="page-container">
          <div className="d-flex justify-content-center">
            <div className="heading">WL Sale</div>
          </div>

          <div className="mint-box">
            <div className="nft-container">
              <img src="/Blue_Berries.gif" alt="nft" />
            </div>

            <div className="number-wrap">
              <img
                className="c-pointer"
                src="/assets/vectors/arrow-left.svg"
                alt="arrow-left"
                onClick={() => {
                  changeNumber("dec");
                }}
              />
              <div className="number">{numberState}</div>
              <img
                className="c-pointer"
                src="/assets/vectors/arrow-right.svg"
                alt="arrow-right"
                onClick={() => {
                  changeNumber("inc");
                }}
              />
            </div>

            <div className="text-center my-3">
              <div className="minted">{soldTotal || 0}/5,556 Minted</div>

              <div className="d-flex align-items-center justify-content-center gap-3">
                <div>Price:</div> <h3>{(Number(publicSalePrice) * Number(numberState)).toFixed(2) || 0} ETH</h3>
              </div>
            </div>

            <div className="btn mint-btn"
              style={{ userSelect: "none" }}
              onClick={() => onClickMint()}
            >Mint</div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Landing;
