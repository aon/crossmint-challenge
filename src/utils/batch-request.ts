import cliProgress from "cli-progress"

import { sleep } from "./sleep"

export const batchRequests = async <T>(
  requests: (() => Promise<T>)[],
  waitTimeMs: number,
  logText: string,
  retries = 2,
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
        await sleep(expWaitTimeMs)
        break
      } catch (e) {
        if (retriesIndex === retries) {
          throw e
        }
        expWaitTimeMs = waitTimeMs * 2 ** retriesIndex
        retriesIndex++
      }
    }

    bar.increment()
  }

  bar.stop()
  console.log()

  return results
}
