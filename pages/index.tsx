import Head from "next/head"
import { ethers } from "ethers";
import { PublicLockV11, UnlockV11 } from "@unlock-protocol/contracts";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from "react";

export default function Home() {

  const [created, setCreated] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  async function createLock(nameOfNft: string, numberOfDays: number, priceOfNft: string) {

    if (typeof window != "undefined") {

      const { ethereum } = window

    if (ethereum) {

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const walletAddress = await signer.getAddress()

      // On goerli Unlock is at
      const address = "0x627118a4fB747016911e5cDA82e2E77C531e8206";

      // Instantiate the Unlock contract
      const unlock = new ethers.Contract(address, UnlockV11.abi, signer);

      // Lock params:
      const lockInterface = new ethers.utils.Interface(PublicLockV11.abi);
      const params = lockInterface.encodeFunctionData(
        "initialize(address,uint256,address,uint256,uint256,string)",
        [
          walletAddress,
          numberOfDays * 60 * 60 * 24,
          ethers.constants.AddressZero, // We use the base chain currency
          ethers.utils.parseUnits(priceOfNft, 18),
          1000,
          nameOfNft,
        ]
      );

      const transaction = await unlock.createUpgradeableLockAtVersion(params, 11);
      console.log(transaction.hash);
      const receipt = await transaction.wait();
      const lockAddress = receipt.logs[0].address;
      console.log(lockAddress);

      if (lockAddress) {
        setCreated(true)
      }
      else {
        setCreated(false)
      }
      
    }

    }

  }
  return(
    <div>
      <Head>
        <title>Custom Unlock Protocol</title>
      </Head>
      <main>
        <ConnectButton />
        <button onClick={async() => createLock("My Nft", 356, "0.01")}>{
          created ? "Lock created!" : "Create custom lock from georli"
        }</button>
      </main>
    </div>
  )
}