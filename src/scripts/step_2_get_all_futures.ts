import { ChainId } from "../types/ChainId"
import { getTokenByAddress } from "../types/tokens"
import { align } from "../utils/align"
import { run as createSDK } from "./step_1_initialize_sdk"

export const run = async () => {
    // Get SDK from previous step
    const { sdk } = await createSDK()

    console.log(`2️⃣  Get all futures`)

    // Fetch all future addresses (as contracts)
    const futureVaults = await sdk.fetchAllFutureVaults()
    console.log(
        `    🔮 Fetched ${futureVaults.length} future vaults. Fetching futures...`
    )

    // Fetch detailed future data (more resource-intensive)
    const futures = await Promise.all(
        futureVaults.map((futureVault) =>
            sdk.fetchFutureAggregateFromAddress(futureVault.address)
        )
    )

    // Display all futures
    console.log(`    ✅ Done! Available futures:`)
    futures.forEach((future) => {
        const ibtSymbol = getTokenByAddress(future.ibtAddress, ChainId.MAINNET)
            .currency.symbol
        const endDate = new Date(
            future.nextPeriodTimestamp.toNumber() * 1000
        ).toLocaleDateString()
        console.log(
            `        - ` +
                `${align(ibtSymbol, 16)} ` +
                `${align(future.platform, 12)} ` +
                `ending on ${align(endDate, 24)}`
        )
    })

    return { sdk, futures }
}
