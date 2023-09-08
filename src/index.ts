import prompts from "prompts"

import { startPrompt } from "./cli"
import { Configuration } from "./configuration"
import { env } from "./env"

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

async function main() {
  // Configuration
  const candidateId = await prompts({
    type: "text",
    name: "candidateId",
    message: "What is your candidate ID?",
    initial: env.CANDIDATE_ID,
  })

  Configuration.candidateId = candidateId.candidateId as string

  console.log(Configuration)

  while (true) {
    await startPrompt()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
