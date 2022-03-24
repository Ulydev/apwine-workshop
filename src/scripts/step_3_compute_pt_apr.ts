import { BigNumber } from "ethers"
import { computeAPR } from "../utils/computeAPR"
import { getDate } from "../utils/getDate"
import { ChainId } from "../types/ChainId"
import { getToken } from "../types/tokens"
import { run as getAllFutures } from "./step_2_get_all_futures"

export const run = async () => {
    // Get SDK and futures from previous step
    const { sdk, futures } = await getAllFutures()

    console.log(`3️⃣  Compute PT APR`)

    // Find a future where we can deposit Lido Staked ETH (stETH)
    const stETH = getToken("stETH")
    const stETHFuture = futures.find(
        (future) => future.ibtAddress === stETH.address[ChainId.MAINNET]
    )

    // Get the corresponding AMM
    console.log(`    🔮 Computing APR for buying PT on the stETH future...`)
    const ptAPR = computeAPR(
        (await getDate(sdk)).getTime(),
        stETHFuture.nextPeriodTimestamp.toNumber() * 1000,
        (await sdk.fetchSpotPrice(
            sdk.FutureVault(stETHFuture.address),
            "PT",
            "Underlying"
        )) as BigNumber
    )
    console.log(`    ✅ Done! APR: ${ptAPR.toFixed(2)}%`)

    return { sdk, stETHFuture }
}
