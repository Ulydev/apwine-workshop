import { BigNumber } from "ethers"
import { formatEther } from "ethers/lib/utils"

export const ethFloat = (amount: BigNumber) => parseFloat(formatEther(amount))
