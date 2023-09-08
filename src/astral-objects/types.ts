export type MapPrimitive = (AstralObject | null)[][]

export type AstralObject = Polyanet | Soloon | Cometh

export interface Polyanet {
  type: "polyanet"
}

export interface Soloon {
  type: "soloon"
  color: "blue" | "red" | "purple" | "white"
}

export interface Cometh {
  type: "cometh"
  direction: "up" | "down" | "left" | "right"
}
