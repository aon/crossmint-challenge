import { type MapPrimitive, type AstralObject } from "./types"

export class Map {
  private map: MapPrimitive

  constructor(map: MapPrimitive) {
    // Check map has at least one row
    if (map.length === 0) {
      throw new Error("Map has no rows")
    }

    // Check map is rectangular
    const width = map[0].length
    for (const row of map) {
      if (row.length !== width) {
        throw new Error("Map is not rectangular")
      }
    }

    this.map = map
  }

  public get(row: number, column: number) {
    if (
      row < 0 ||
      column < 0 ||
      row >= this.map.length ||
      column >= this.map[0].length
    ) {
      throw new Error("Out of bounds")
    }

    return this.map[row][column]
  }

  public getNonEmpty() {
    const nonEmpty: {
      row: number
      column: number
      cell: AstralObject
    }[] = []

    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[0].length; column++) {
        const cell = this.get(row, column)
        if (cell !== null) {
          nonEmpty.push({
            row,
            column,
            cell,
          })
        }
      }
    }

    return nonEmpty
  }

  public diff(other: Map) {
    // Check maps are the same size
    if (
      this.map.length !== other.map.length ||
      this.map[0].length !== other.map[0].length
    ) {
      throw new Error("Maps are not the same size")
    }

    // Compare each cell
    const diff: {
      row: number
      column: number
      currentCell: AstralObject | null
      otherCell: AstralObject | null
    }[] = []

    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[0].length; column++) {
        const thisCell = this.get(row, column)
        const otherCell = other.get(row, column)
        if (thisCell?.type !== otherCell?.type) {
          diff.push({
            row,
            column,
            currentCell: thisCell,
            otherCell,
          })
        }
      }
    }

    return diff
  }

  public toString() {
    let string = ""
    for (const row of this.map) {
      let rowStr = ""
      for (const cell of row) {
        if (cell === null) {
          rowStr += "🌌"
        } else if (cell.type === "polyanet") {
          rowStr += "🪐"
        } else if (cell.type === "soloon") {
          switch (cell.color) {
            case "blue":
              rowStr += "🔵"
              break
            case "red":
              rowStr += "🔴"
              break
            case "purple":
              rowStr += "🟣"
              break
            case "white":
              rowStr += "⚪"
              break
          }
        } else if (cell.type === "cometh") {
          switch (cell.direction) {
            case "up":
              rowStr += "⬆️ "
              break
            case "down":
              rowStr += "⬇️ "
              break
            case "left":
              rowStr += "⬅️ "
              break
            case "right":
              rowStr += "➡️ "
              break
          }
        } else {
          throw new Error("Invalid cell")
        }
      }
      string += rowStr + "\n"
    }

    return string.slice(0, -1)
  }
}
