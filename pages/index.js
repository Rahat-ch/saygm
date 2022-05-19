import { useState } from "react";
import GmForm from "../components/GmForm";
import styles from "../styles/Home.module.css";
import abi from "../utils/abi.json"
import { ethers } from "ethers";

const contractAddress = "0x0a4243998b3844B3D96b87B8f3Fb80a2E62010dE"

export default function Home() {
  const [address, setAddress] = useState("");
  const [gmContract, setGmContract] = useState({});
  const handleWalletConnect = async () => {
  const { ethereum } = window;
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setAddress(address);
    const connectedContract = new ethers.Contract(contractAddress, abi.abi, signer);
    setGmContract(connectedContract)
  } else {
    alert("No Wallet Detected");
  }
};
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {address ? (
          <GmForm address={address} gmContract={gmContract} />
        ) : (
          <button onClick={() => handleWalletConnect()}>Connect Wallet</button>
        )}
      </main>
    </div>
  );
}
