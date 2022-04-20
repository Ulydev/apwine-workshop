import { AMOUNT_TO_TOKENIZE, run as tokenizeIBT } from "./step_4_tokenize_ibt"
import { balance } from "../utils/balance"
import { AMM__factory } from "../contracts/AMM__factory"
import { ethFloat } from "../utils/ethFloat"
import { computeAPR } from "../utils/computeAPR"
import { getDate } from "../utils/getDate"
import { constants } from "ethers"

export const run = async () => {
    // Get stETH future from previous step
    const { sdk, stETHFuture } = await tokenizeIBT()

    console.log(`5️⃣  Swap FYT for PT`)

    const user = await sdk.signer.getAddress()
    const fytAddress = await sdk
        .FutureVault(stETHFuture.address)
        .getFYTofPeriod(1)
    const fytBalance = await balance(sdk.provider, fytAddress, user)

    // Execute a FYT -> PT swap on the AMM
    console.log(`    🔮 Swapping FYT for PT...`)
    const ammAddress = await sdk.AMMRegistry.getFutureAMMPool(
        stETHFuture.address
    )
    const amm = AMM__factory.connect(ammAddress, sdk.provider)
    await sdk.swapIn(
        {
            amm,
            from: "FYT",
            to: "PT",
            amount: fytBalance,
        },
        { autoApprove: true } // Approve automatically if needed
    )

    // Get final PT balance and compute resulting APR
    const ptBalance = await balance(sdk.provider, stETHFuture.ptAddress, user)
    console.log(`    ✅ Done! Result: ${ethFloat(ptBalance).toFixed(2)} PT.`)
    console.log(
        `\n    💥 Final guaranteed APR with strategy: ${computeAPR(
            (await getDate(sdk)).getTime(),
            stETHFuture.nextPeriodTimestamp.toNumber() * 1000,
            ptBalance.mul(constants.WeiPerEther).div(AMOUNT_TO_TOKENIZE)
        ).toFixed(2)}%`
    )

    return { stETHFuture }
}
