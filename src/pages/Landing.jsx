import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NotificationManager } from "react-notifications";

import MainLayout from "../layouts/MainLayout";
import { getSoldTotal, getPublicSalePrice, getAlSalePrice, getAlDayOneSalePrice, getMaxPerWallet, isInALWL, getMintedByWallet, isInFLWL, doALSale, doFreemint } from "../interactWithSmartContracts/interacts";
import { ETHEREUM_CHAIN_ID } from "../env";

const Landing = () => {

  const globalAccount = useSelector((state) => state.auth.currentWallet);
  const globalWeb3 = useSelector((state) => state.auth.globalWeb3);
  const globalChainId = useSelector(state => state.auth.currentChainId);

  const [numberState, setNumberState] = useState(0);
  const [soldTotal, setSoldTotal] = useState(0);
  const [publicSalePrice, setPublicSalePrice] = useState(0);
  const [alSalePrice, setAlSalePrice] = useState(0);
  const [alDayOneSalePrice, setAlDayOneSalePrice] = useState(0);
  const [maxPerWallet, setMaxPerWallet] = useState(3);
  const [freeMinted, setFreeminted] = useState(0);
  const [notFreeMinted, setNotFreeMinted] = useState(0);
  const [canALBuy, setCanALBuy] = useState(false);
  const [canFreeBuy, setCanFreeBuy] = useState(false);

  useEffect(() => {
    let timer = setInterval(() => {
      fetchAllNecessaryValues();
    }, 5000);
    return () => {if(timer>0) clearInterval(timer)}
  }, []);

  const fetchAllNecessaryValues  = async () => {   
    if (globalAccount) {   
      let promiseArr = [];
      promiseArr.push(getSoldTotal(globalWeb3));
      promiseArr.push(getPublicSalePrice(globalWeb3));
      promiseArr.push(getAlSalePrice(globalWeb3));
      promiseArr.push(getAlDayOneSalePrice(globalWeb3));
      promiseArr.push(getMaxPerWallet(globalWeb3));
      promiseArr.push(getMintedByWallet(globalWeb3, globalAccount));
      promiseArr.push(globalWeb3, isInALWL(globalAccount));
      promiseArr.push(globalWeb3, isInFLWL(globalAccount)); 
      Promise.all(promiseArr)
      .then((values) => {
        if(values[0].success === true) setSoldTotal(values[0].value);
        if(values[1].success === true) 
        {
          let temp = values[1].value;
          console.log("pu price = ", temp.toString())
          setPublicSalePrice(Number(temp.toString()));
        }
        if(values[2].success === true) 
        {
          let temp1 = values[2].value;
          console.log("al price = ", temp1.toString())

          setAlSalePrice(Number(temp1.toString()));
        }
        if(values[3].success === true) setAlDayOneSalePrice(values[3].value);
        if(values[4].success === true) setMaxPerWallet(values[4].value);
        if(values[5].success === true) 
        {
          setNotFreeMinted(values[5].value[0]);
          setFreeminted(values[5].value[1]);
        }
        if(values[6].success === true) setCanALBuy(values[6].value);
        if(values[7].success === true) setCanFreeBuy(values[7].value);
      })
      .catch((error) => {
        console.log(error)
      })
    }
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
      if(notFreeMinted >= 2 ) {     
        NotificationManager.warning("You can not mint more than 2 NFTs", 'Warning', 5000, () => {});
        return;        
      }
      try{
        let returnObject = {}; 
        returnObject = await  isInALWL(globalWeb3, globalAccount);
        if(returnObject.success == true && returnObject.value == true ) { 
          returnObject = await doALSale(globalWeb3, globalAccount, numberState, alSalePrice);
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

  const onClickFreeMint = async () => {
    if(globalAccount && globalWeb3)
    {
      if(globalChainId !== ETHEREUM_CHAIN_ID) {      
        NotificationManager.warning("Please connect your wallet to Ethereum network and retry", 'Warning', 5000, () => {});
        return;
      }
      if(numberState > maxPerWallet) {     
        NotificationManager.warning("You can not mint more than "+maxPerWallet+" NFTs.", 'Warning', 5000, () => {});
        return;        
      }
      if(freeMinted >= 1 ) {     
        NotificationManager.warning("You can not mint more than 1 NFT on free", 'Warning', 5000, () => {});
        return;        
      }
      try{
        let returnObject = {}; 
        returnObject = await  isInFLWL(globalWeb3, globalAccount);
        if(returnObject.success == true && returnObject.value == true ) { 
          returnObject = await doFreemint(globalWeb3, globalAccount);
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
            <div className="heading">AL Sale</div>
          </div>

          <div className="mint-box">
            <div className="nft-container">
            <video width="320" height="240"  autoPlay={true} muted loop={false} >
              <source src="/Blue_Berries.mp4" type="video/mp4" ></source>
            </video>
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
                <div>Price:</div> <h3>{(Number(alSalePrice) * Number(numberState)).toFixed(4) || 0} ETH</h3>
              </div>
            </div>

            <div className="btn mint-btn"
              style={{ userSelect: "none" }}
              onClick={() => onClickMint()}
            >AL Mint</div>

            <div className="btn mint-btn"
              style={{ userSelect: "none" }}
              onClick={() => onClickFreeMint()}
            >Free Mint</div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Landing;
