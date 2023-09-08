import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export const env = createEnv({
  server: {
    MEGAVERSE_API_BASE_URL: z
      .string()
      .url()
      .default("https://challenge.crossmint.io/api"),
    CANDIDATE_ID: z.string().optional(),
    VERBOSE: z.preprocess(
      (value: unknown) => value === "true",
      z.boolean().default(false),
    ),
  },
  runtimeEnv: process.env,
})
