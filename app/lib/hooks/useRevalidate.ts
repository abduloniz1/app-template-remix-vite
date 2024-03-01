import { useRevalidator } from '@remix-run/react'
import { useEffect } from 'react'

interface Options {
  enabled?: boolean
  interval?: number
}

function useRevalidateOnInterval({
  enabled = false,
  interval = 1000,
}: Options) {
  const { revalidate } = useRevalidator()

  useEffect(
    function revalidateOnInterval() {
      if (!enabled) return
      let intervalId = setInterval(revalidate, interval)
      return () => clearInterval(intervalId)
    },
    [revalidate],
  )
}

export default useRevalidateOnInterval
