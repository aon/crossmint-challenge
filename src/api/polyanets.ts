import axios from "axios"

import { Configuration } from "../configuration"

export const addPolyanet = async (row: number, column: number) => {
  await axios.post(`${Configuration.megaverseApi.baseUrl}/polyanets`, {
    row,
    column,
    candidateId: Configuration.candidateId,
  })
}

export const deletePolyanet = async (row: number, column: number) => {
  await axios.delete(`${Configuration.megaverseApi.baseUrl}/polyanets`, {
    data: {
      row,
      column,
      candidateId: Configuration.candidateId,
    },
  })
}
