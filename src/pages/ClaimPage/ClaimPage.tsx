import { useEffect } from "react";
import { TonConnectButton, TonConnectUIProvider, useTonAddress } from "@tonconnect/ui-react";
import { Lootbox } from "@/components/Lootbox";
import { initInitData } from "@telegram-apps/sdk";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL

export const ClaimPage = () => {
  const initData = initInitData();
  const walletAddress = useTonAddress();


  const setWalletAddress = async () => {
    axios.post(`${BACKEND_URL}addWalletAddr`, { uuid: initData?.startParam, walletAddr: walletAddress });
  }

  useEffect(() => {
    if (walletAddress) {
      setWalletAddress();
      // alert(`"Wallet Address Update", ${walletAddress}, "::StartParam", ${initData?.startParam}`)
    } else {
      console.log("Wallet Address not found.")
      // alert("Wallet Address not found")
    }
  }, [walletAddress]);

  console.log("Init Data:", initData, "0Wallet Addr:", walletAddress);

  return (
    <TonConnectUIProvider manifestUrl="https://lootfront.netlify.app/tonconnect-manifest.json">
      <div className="mt-10 flex flex-col items-center justify-center justify-items-center" style={{ paddingTop: '32%' }}>
        <div style={{
          width: '200%',
          height: '200%',
          backgroundColor: '#000',
          position: 'fixed',
          top: '0',
          zIndex: '0'
        }}></div>
        <Lootbox width={280} height={280} />

        <div className="text-white text-center items-center justify-center  text-2xl transition ease-in-out delay-150 mb-5 slowshow" style={{ zIndex: '100' }}>
          <span>
            <h1 style={{ fontWeight: 'bolder' }}>CONGRATULATIONS<br /> YOU HAVE UNLOCKED <br />5 USDT!</h1>
          </span>
        </div>
        <TonConnectButton style={{ zIndex: '100' }} className="slowshow" />
      </div>
    </TonConnectUIProvider>
  );
};
