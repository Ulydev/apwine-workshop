import { Currency as UniswapCurrency } from "@uniswap/sdk"

class Currency extends UniswapCurrency {
    public constructor(decimals: number, symbol: string, name: string) {
        super(decimals, symbol, name)
    }
}

export default Currency
