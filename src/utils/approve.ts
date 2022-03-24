import { ERC20__factory } from "../contracts/ERC20__factory"
import { BigNumber, Signer } from "ethers"

export const approve = (
    signer: Signer,
    tokenAddress: string,
    spender: string,
    amount: BigNumber
) => ERC20__factory.connect(tokenAddress, signer).approve(spender, amount)
