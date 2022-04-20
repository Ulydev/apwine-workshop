import { run as computePTAPR } from "./step_3_compute_pt_apr"
import { depositLidoETH } from "../utils/depositLidoETH"
import { parseEther } from "ethers/lib/utils"
import { balance } from "../utils/balance"
import { ethFloat } from "../utils/ethFloat"

export const AMOUNT_TO_TOKENIZE = parseEther("10")

export const run = async () => {
    // Get stETH future from previous step
    const { sdk, stETHFuture } = await computePTAPR()

    console.log(`4️⃣  Tokenize stETH Future Yield`)

    // First, we need to deposit ETH on Lido to get stETH
    console.log(
        `    🔮 Depositing ${ethFloat(
            AMOUNT_TO_TOKENIZE
        ).toFixed()} ETH on Lido...`
    )
    await depositLidoETH(sdk, AMOUNT_TO_TOKENIZE)

    // Next, we deposit our newly acquired stETH on the APWine stETH future vault
    console.log(`    🔮 Depositing stETH on APWine...`)
    await sdk
        .deposit(
            sdk.FutureVault(stETHFuture.address),
            AMOUNT_TO_TOKENIZE.sub(1), // stETH is missing 1 unit precision
            { autoApprove: true } // Approve automatically if needed. Will require an extra transaction
        )
        .catch(console.error)

    const user = await sdk.signer.getAddress()
    const ptBalance = await balance(sdk.provider, stETHFuture.ptAddress, user)
    const fytBalance = await balance(
        sdk.provider,
        await sdk.FutureVault(stETHFuture.address).getFYTofPeriod(1),
        user
    )
    console.log(
        `    ✅ Done! Retrieved ${ethFloat(ptBalance).toFixed(
            2
        )} PT and ${ethFloat(fytBalance).toFixed(2)} FYT.`
    )

    return { sdk, stETHFuture }
}
