require("dotenv").config()

module.exports = {
    networks: {
        hardhat: {
            forking: {
                url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
                blockNumber: 14300000,
            },
        },
    },
}
