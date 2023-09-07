import { env } from "./env"

export const Configuration = {
  megaverseApi: {
    baseUrl: env.MEGAVERSE_API_BASE_URL,
  },
  candidateId: env.CANDIDATE_ID,
}
