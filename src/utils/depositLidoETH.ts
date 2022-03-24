import APWineSDK from "@apwine/sdk"
import { BigNumber } from "ethers"

export const STETH_ADDRESS = "0xae7ab96520de3a18e5e111b5eaab095312d7fe84"

export const depositLidoETH = async (sdk: APWineSDK, amount: BigNumber) => {
    return await (
        await sdk.signer.sendTransaction({
            to: STETH_ADDRESS,
            value: amount,
        })
    ).wait()
}
