import { ERC20__factory } from "../contracts/ERC20__factory"
import { BigNumber, providers } from "ethers"

export const balance = (
    provider: providers.Provider,
    tokenAddress: string,
    address: string
) => ERC20__factory.connect(tokenAddress, provider).balanceOf(address)
