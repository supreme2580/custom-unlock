import ethers from "ethers"
import abis from "@unlock-protocol/contracts"

export default function connectContract() {
    const address = "0x09A8F16Ed16C28f4774aBF73eCc071cfB423Ac24"
    let contract
    try {
        const { ethereum } = window
        if (ethereum) {
            const provider = new ethers.providers.JsonRpcProvider(
                "https://rpc.unlock-protocol.com/5"
            );
            contract = new ethers.Contract(address, abis.PublicLockV11.abi, provider);
        }
        return contract
    } catch (error) {
        console.log(error)
    }
}