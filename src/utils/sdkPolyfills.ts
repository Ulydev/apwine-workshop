import APWineSDK from "@apwine/sdk"
import { applySlippage, findSwapPath } from "@apwine/sdk/utils"
import { BigNumber, constants } from "ethers"
import { AMMRouter__factory } from "../contracts/AMMRouter__factory"

const swap = async (
    sdk: APWineSDK,
    swapType: "IN" | "OUT",
    params: any,
    options: any
): Promise<any> => {
    const {
        signer,
        network,
        amm,
        from,
        to,
        amount: rawAmount,
        slippageTolerance,
        deadline,
    } = params

    const amount = BigNumber.from(rawAmount)
    const router = AMMRouter__factory.connect(sdk.Router.address, signer)
    const user = await signer.getAddress()
    const { poolPath, tokenPath } = findSwapPath(from, to)

    if (poolPath && tokenPath) {
        const getAmount =
            swapType === "IN" ? router.getAmountOut : router.getAmountIn
        const tokenAmount = await getAmount(
            amm.address,
            poolPath,
            tokenPath,
            amount
        )
        const tokenAmountWithSlippage =
            swapType === "IN"
                ? applySlippage(tokenAmount, -slippageTolerance)
                : applySlippage(tokenAmount, slippageTolerance)

        const amountIn = swapType === "IN" ? amount : tokenAmountWithSlippage
        const amountOut = swapType === "IN" ? tokenAmountWithSlippage : amount

        const swap =
            swapType === "IN"
                ? router.swapExactAmountIn
                : router.swapExactAmountOut

        const transaction = await swap(
            amm.address,
            poolPath,
            tokenPath,
            amountIn,
            amountOut,
            user,
            deadline?.getTime() ?? Date.now() + 60,
            constants.AddressZero // FIXME: include this in main repo
        )

        return { transaction }
    }
}

export const sdkPolyfills = (sdk: APWineSDK) => {
    // Temporary polyfills
    sdk.Controller = sdk.Controller.connect(sdk.signer)
    sdk.Router = AMMRouter__factory.connect(
        "0xf5ba2E5DdED276fc0f7a7637A61157a4be79C626",
        sdk.signer
    ) as any
    sdk.swapIn = (params: any, options?: any) =>
        swap(
            sdk,
            "IN",
            {
                slippageTolerance: sdk.defaultSlippage,
                signer: sdk.signer!,
                network: sdk.network,
                ...params,
            },
            options
        )
}
