import { provider } from "../scripts/step_1_initialize_sdk"

export const resetFork = async (block: number) => {
    return await provider.send("hardhat_reset", [
        {
            forking: {
                jsonRpcUrl: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
                blockNumber: block,
            },
        },
    ])
}
