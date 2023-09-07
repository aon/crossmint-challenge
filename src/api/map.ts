import axios from "axios"
import { z } from "zod"

import { Configuration } from "../configuration"

export const getMap = async () => {
  const res = await axios.get(
    `${Configuration.megaverseApi.baseUrl}/map/${Configuration.candidateId}`,
  )
  const parsedRes = getMapResponseSchema.parse(res.data)
  return parsedRes
}

const getMapResponseSchema = z.object({
  map: z.object({
    _id: z.string(),
    content: z.array(
      z.array(
        z.union([
          z.null(),
          z.object({
            type: z.literal(0),
          }),
          z.object({
            type: z.literal(1),
            color: z.enum(["blue", "red", "purple", "white"]),
          }),
          z.object({
            type: z.literal(2),
            direction: z.enum(["up", "down", "left", "right"]),
          }),
        ]),
      ),
    ),
    candidateId: z.string(),
    phase: z.number(),
    __v: z.number(),
  }),
})
