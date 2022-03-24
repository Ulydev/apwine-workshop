import { command, run, number, option } from "cmd-ts"
import { resetFork } from "../utils/resetFork"

const ALL_STEPS = [
    require("./step_1_initialize_sdk").run,
    require("./step_2_get_all_futures").run,
    require("./step_3_compute_pt_apr").run,
    require("./step_4_tokenize_ibt").run,
    require("./step_5_swap_fyt").run,
]

const BLOCK_NUMBER = 14200000

const cmd = command({
    name: "generate-proposal-choices",
    description: "Generates choices for Snapshot proposals",
    version: "1.0.0",
    args: {
        step: option({ type: number, long: "step" }),
    },
    handler: (args) => {
        if (args.step < 1 || args.step > ALL_STEPS.length) {
            console.error(`❌ Step must be between 1 and ${ALL_STEPS.length}`)
        } else {
            // Fork Mainnet before running
            resetFork(BLOCK_NUMBER).then(() => ALL_STEPS[args.step - 1]())
        }
    },
})

run(cmd, process.argv.slice(2))
