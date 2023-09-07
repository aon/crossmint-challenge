import { type getGoalMap } from "../api/goal-map"
import { type getMap } from "../api/map"
import { Map } from "../astral-objects/map"

export const parseMap = (map: Awaited<ReturnType<typeof getMap>>): Map => {
  return new Map(
    map.map.content.map((row) =>
      row.map((cell) => {
        if (cell === null) {
          return null
        } else if (cell.type === 0) {
          return {
            type: "polyanet",
          }
        } else if (cell.type === 1) {
          return {
            type: "soloon",
            color: cell.color,
          }
        } else if (cell.type === 2) {
          return {
            type: "cometh",
            direction: cell.direction,
          }
        } else {
          throw new Error("Invalid cell")
        }
      }),
    ),
  )
}

export const parseGoalMap = (
  map: Awaited<ReturnType<typeof getGoalMap>>,
): Map => {
  return new Map(
    map.goal.map((row) =>
      row.map((cell) => {
        switch (cell) {
          case "SPACE":
            return null
          case "POLYANET":
            return { type: "polyanet" }
          case "BLUE_SOLOON":
            return { type: "soloon", color: "blue" }
          case "RED_SOLOON":
            return { type: "soloon", color: "red" }
          case "PURPLE_SOLOON":
            return { type: "soloon", color: "purple" }
          case "WHITE_SOLOON":
            return { type: "soloon", color: "white" }
          case "UP_COMETH":
            return { type: "cometh", direction: "up" }
          case "DOWN_COMETH":
            return { type: "cometh", direction: "down" }
          case "LEFT_COMETH":
            return { type: "cometh", direction: "left" }
          case "RIGHT_COMETH":
            return { type: "cometh", direction: "right" }
        }
      }),
    ),
  )
}
