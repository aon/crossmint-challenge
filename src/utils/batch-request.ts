import { AxiosError } from "axios"
import cliProgress from "cli-progress"

import { sleep } from "./sleep"

export const batchRequests = async <T>(
  requests: (() => Promise<T>)[],
  logText: string,
  waitTimeMs = 200,
  retries = 10,
): Promise<T[]> => {
  console.log()
  const bar = new cliProgress.SingleBar(
    {
      format: `${logText} | {bar} | {percentage}% | ETA: {eta}s | {value}/{total}`,
      hideCursor: true,
    },
    cliProgress.Presets.shades_grey,
  )
  bar.start(requests.length, 0)

  const results: T[] = []

  for (const request of requests) {
    let retriesIndex = 0
    let expWaitTimeMs = waitTimeMs

    while (true) {
      try {
        results.push(await request())
        break
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 429) {
          if (retriesIndex === retries) {
            throw err
          }
          await sleep(expWaitTimeMs)
          expWaitTimeMs = waitTimeMs * 2 ** retriesIndex
          retriesIndex++
          continue
        }

        throw err
      }
    }
    bar.increment()
  }

  bar.stop()
  console.log()

  return results
}
