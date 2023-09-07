import axios from "axios"

import { type Cometh } from "../astral-objects/types"
import { Configuration } from "../configuration"

export const addCometh = async (
  row: number,
  column: number,
  direction: Cometh["direction"],
) => {
  await axios.post(`${Configuration.megaverseApi.baseUrl}/comeths`, {
    row,
    column,
    direction,
    candidateId: Configuration.candidateId,
  })
}

export const deleteCometh = async (row: number, column: number) => {
  await axios.delete(`${Configuration.megaverseApi.baseUrl}/comeths`, {
    data: {
      row,
      column,
      candidateId: Configuration.candidateId,
    },
  })
}
