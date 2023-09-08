import chalk from "chalk"

import { Configuration } from "../configuration"

export const logError = (message: string, error: unknown) => {
  console.error(chalk.red.bold(`\n✖ ${message}\n`))
  console.error(
    chalk.yellow(
      "Tip: you can enable verbose mode by setting the env VERBOSE=true\n",
    ),
  )
  if (Configuration.verbose) {
    console.error(error)
  }
}
