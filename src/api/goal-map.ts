import axios from "axios"
import { z } from "zod"

import { Configuration } from "../configuration"

export const getGoalMap = async () => {
  const res = await axios.get(
    `${Configuration.megaverseApi.baseUrl}/map/${Configuration.candidateId}/goal`,
  )
  const parsedRes = getGoalMapResponseSchema.parse(res.data)
  return parsedRes
}

const getGoalMapResponseSchema = z.object({
  goal: z.array(
    z.array(
      z.enum([
        "SPACE",
        "POLYANET",
        "BLUE_SOLOON",
        "RED_SOLOON",
        "PURPLE_SOLOON",
        "WHITE_SOLOON",
        "UP_COMETH",
        "DOWN_COMETH",
        "LEFT_COMETH",
        "RIGHT_COMETH",
      ]),
    ),
  ),
})
