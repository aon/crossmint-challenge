import prompts from "prompts"

import { addCometh, deleteCometh } from "./api/comeths"
import { getGoalMap } from "./api/goal-map"
import { getMap } from "./api/map"
import { addPolyanet, deletePolyanet } from "./api/polyanets"
import { addSoloon, deleteSoloon } from "./api/soloons"
import { batchRequests } from "./utils/batch-request"
import { logError } from "./utils/errors"
import { parseGoalMap, parseOwnMap } from "./utils/map-parsers"

type SelectOption = "map" | "goal-map" | "match" | "clean" | "exit"

export const startPrompt = async () => {
  const response = await prompts(
    [
      {
        type: "select",
        name: "value",
        message: "What do you want to do?",
        choices: [
          { title: "Show my map", value: "map" },
          { title: "Show the goal map", value: "goal-map" },
          { title: "Match my map to the goal map", value: "match" },
          { title: "Clean up my map", value: "clean" },
          { title: "Exit", value: "exit" },
        ] satisfies { title: string; value: SelectOption }[],
      },
    ],
    {
      onCancel: exit,
    },
  )

  switch (response.value as SelectOption) {
    case "map": {
      await showMap()
      break
    }
    case "goal-map": {
      await showGoalMap()
      break
    }
    case "match": {
      await matchMaps()
      break
    }
    case "clean": {
      await clean()
      break
    }
    case "exit": {
      exit()
    }
  }
}

const showMap = async () => {
  try {
    const rawMap = await getMap()
    const parsedMap = parseOwnMap(rawMap)
    console.log(`\n${parsedMap.toString()}\n`)
  } catch (err) {
    logError("Failed to show map", err)
  }
}

const showGoalMap = async () => {
  try {
    const rawMap = await getGoalMap()
    const parsedMap = parseGoalMap(rawMap)
    console.log(`\n${parsedMap.toString()}\n`)
  } catch (err) {
    logError("Failed to show goal map", err)
  }
}

const matchMaps = async () => {
  try {
    const [rawGoalMap, rawMap] = await Promise.all([getGoalMap(), getMap()])
    const parsedGoalMap = parseGoalMap(rawGoalMap)
    const parsedMap = parseOwnMap(rawMap)
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
    await batchRequests(requests, "Matching map")
    console.log("Done!\n")
  } catch (err) {
    logError("Failed to match maps", err)
  }
}

const clean = async () => {
  try {
    const rawMap = await getMap()
    const parsedMap = parseOwnMap(rawMap)
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
    await batchRequests(requests, "Cleaning map")
    console.log("Done!\n")
  } catch (err) {
    logError("Failed to clean map", err)
  }
}

const exit = () => {
  console.log("\nHope I get the job 🥹. Bye!")
  process.exit(0)
}
