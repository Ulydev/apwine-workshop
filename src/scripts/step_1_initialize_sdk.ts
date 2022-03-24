require("dotenv").config()

import APWineSDK from "@apwine/sdk"
import { ethers } from "ethers"
import { checkEnv } from "../utils/checkEnv"
import { ChainId } from "../types/ChainId"
import { sdkPolyfills } from "../utils/sdkPolyfills"

export const provider = new ethers.providers.JsonRpcProvider(
    "http://localhost:8545"
)

export const run = async () => {
    console.log(`1️⃣  Initialize APWine SDK`)

    // Verify .env file is correctly set up
    if (
        !checkEnv(process.env.ALCHEMY_API_KEY, "Alchemy API key") ||
        !checkEnv(process.env.PRIVATE_KEY, "private key")
    ) {
        return null
    }

    // Create APWine SDK
    const sdk: APWineSDK = new APWineSDK(
        {
            provider,
            signer: new ethers.Wallet(process.env.PRIVATE_KEY, provider),
            network: ChainId.MAINNET,
        },
        { initialize: false }
    )
    console.log(`    🔮 Created APWine SDK. Initializing...`)

    // Initialize SDK. This will load essential data such as contract addresses.
    try {
        await sdk.initialize()
    } catch (error) {
        console.error(`    ❌ Failed. ${error}`)
        return null
    }
    console.log(
        `    ✅ APWine SDK initialized on ${ChainId[sdk.network.toString()]}`
    )

    sdkPolyfills(sdk)

    return { sdk }
}
