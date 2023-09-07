import prompts from "prompts"

import { addCometh, deleteCometh } from "./api/comeths"
import { getGoalMap } from "./api/goal-map"
import { getMap } from "./api/map"
import { addPolyanet, deletePolyanet } from "./api/polyanets"
import { addSoloon, deleteSoloon } from "./api/soloons"
import { Configuration } from "./configuration"
import { env } from "./env"
import { batchRequests } from "./utils/batch-request"
import { parseGoalMap, parseMap } from "./utils/map-parsers"

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

  while (true) {
    const response = await prompts([
      {
        type: "select",
        name: "value",
        message: "What do you want to do?",
        choices: [
          { title: "Get my map", value: "map" },
          { title: "See the goal map", value: "goal-map" },
          { title: "Match my map to the goal map", value: "match" },
          { title: "Clean up my map", value: "clean" },
          { title: "Exit", value: "exit" },
        ],
      },
    ])

    switch (response.value) {
      case "map": {
        const rawMap = await getMap()
        const parsedMap = parseMap(rawMap)
        console.log(`\n${parsedMap.toString()}\n`)
        break
      }
      case "goal-map": {
        const rawMap = await getGoalMap()
        const parsedMap = parseGoalMap(rawMap)
        console.log(`\n${parsedMap.toString()}\n`)
        break
      }
      case "match": {
        const [rawGoalMap, rawMap] = await Promise.all([getGoalMap(), getMap()])
        const parsedGoalMap = parseGoalMap(rawGoalMap)
        const parsedMap = parseMap(rawMap)
        const diff = parsedMap.diff(parsedGoalMap)
        const requests = diff.map((d) => {
          switch (d.otherCell?.type) {
            case "polyanet":
              return () => addPolyanet(d.row, d.column)
            case "cometh":
              const direction = d.otherCell.direction
              return () => addCometh(d.row, d.column, direction)
            case "soloon":
              const color = d.otherCell.color
              return () => addSoloon(d.row, d.column, color)
            case undefined:
              switch (d.currentCell?.type) {
                case "polyanet":
                  return () => deletePolyanet(d.row, d.column)
                case "cometh":
                  return () => deleteCometh(d.row, d.column)
                case "soloon":
                  return () => deleteSoloon(d.row, d.column)
                case undefined:
                  throw new Error("Invalid cell")
              }
          }
        })
        await batchRequests(requests, 500, "Matching map")
        console.log("Done!\n")
        break
      }
      case "clean": {
        const rawMap = await getMap()
        const parsedMap = parseMap(rawMap)
        const nonEmpty = parsedMap.getNonEmpty()
        const requests = nonEmpty.map((cell) => {
          switch (cell.cell.type) {
            case "polyanet":
              return () => deletePolyanet(cell.row, cell.column)
            case "cometh":
              return () => deleteCometh(cell.row, cell.column)
            case "soloon":
              return () => deleteSoloon(cell.row, cell.column)
          }
        })
        await batchRequests(requests, 500, "Cleaning map")
        console.log("Done!\n")
        break
      }
      case "exit": {
        return
      }
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
