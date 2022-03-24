export const checkEnv = (v: any, name: string) => {
    if (!v) {
        console.error(
            `    ❌ No ${name} provided. Make sure you've renamed .env.example to .env and filled the file correctly.`
        )
        return false
    } else {
        return true
    }
}
