import { BigNumber } from "ethers"
import { formatEther } from "ethers/lib/utils"

const MILLISECONDS_PER_YEAR = 1000 * 3600 * 24 * 365
export const computeAPR = (now: number, end: number, price: BigNumber) => {
    const timeLeft = end - now
    return (
        ((parseFloat(formatEther(price)) - 1) / timeLeft) *
        MILLISECONDS_PER_YEAR *
        100
    )
}
