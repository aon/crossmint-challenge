import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  server: {
    MEGAVERSE_API_BASE_URL: z
      .string()
      .url()
      .default("https://challenge.crossmint.io/api"),
    CANDIDATE_ID: z.string().optional(),
  },
  runtimeEnv: process.env,
})
