import axios from "axios"

import { type Soloon } from "../astral-objects/types"
import { Configuration } from "../configuration"

export const addSoloon = async (
  row: number,
  column: number,
  color: Soloon["color"],
) => {
  await axios.post(`${Configuration.megaverseApi.baseUrl}/soloons`, {
    row,
    column,
    color,
    candidateId: Configuration.candidateId,
  })
}

export const deleteSoloon = async (row: number, column: number) => {
  await axios.delete(`${Configuration.megaverseApi.baseUrl}/soloons`, {
    data: {
      row,
      column,
      candidateId: Configuration.candidateId,
    },
  })
}
