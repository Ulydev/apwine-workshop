import APWineSDK from "@apwine/sdk"

export const getDate = async (sdk: APWineSDK) =>
    new Date((await sdk.provider.getBlock("latest")).timestamp * 1000)
