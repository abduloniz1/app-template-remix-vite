import { type WriteContractMode } from '@wagmi/core'
import { useEffect, useMemo, useRef } from 'react'
import type { Abi, TransactionReceipt } from 'viem'
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  type UseContractWriteConfig,
  type UsePrepareContractWriteConfig,
} from 'wagmi'

type Handler = (receipt: TransactionReceipt) => void

type UseContractWriteAndWaitConfig = {
  onReceipt?: Handler
}

export function usePreparedContractWriteAndWait<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TChainId extends number,
>(
  prepareContractWriteConfig: UseContractWriteAndWaitConfig &
    UsePrepareContractWriteConfig<TAbi, TFunctionName, TChainId>,
) {
  const { config } = usePrepareContractWrite<TAbi, TFunctionName, TChainId>(
    prepareContractWriteConfig,
  )

  // Add 20% to the estimated gas just to be safe
  const configWithPaddedGasLimit = useMemo(() => {
    if (!config || !config.request) {
      return config
    } else {
      return {
        ...config,
        request: {
          ...config.request,
          gasLimit: addGasMargin(
            config.request.gas
              ? config.request.gasPrice
                ? config.request.gas
                : 0n
              : 0n,
          ),
        },
      }
    }
  }, [config])

  return useContractWriteAndWait<TAbi, TFunctionName, 'prepared'>(config)
}

export function useContractWriteAndWait<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TMode extends WriteContractMode,
>(
  contractWriteConfig: UseContractWriteAndWaitConfig &
    UseContractWriteConfig<TAbi, TFunctionName, TMode>,
) {
  const {
    data,
    isIdle,
    isLoading: awaitingWalletConfirmation,
    isError,
    writeAsync,
    reset,
  } = useContractWrite<TAbi, TFunctionName, TMode>(contractWriteConfig)

  const transactionSettledHandler = useRef<Handler>(() => {})

  const {
    data: receipt,
    isLoading: awaitingOnChainConfirmation,
    isSuccess,
  } = useWaitForTransaction({
    hash: data?.hash,
  })

  const onReceipt = useRef((handler: Handler) => {
    transactionSettledHandler.current = handler
  })

  useEffect(() => {
    if (receipt) {
      transactionSettledHandler.current(receipt)
    }
  }, [receipt])

  return {
    data,
    isIdle,
    isError,
    awaitingWalletConfirmation,
    awaitingOnChainConfirmation,
    receipt,
    writeAsync,
    reset,
    isSuccess,
    onReceipt: onReceipt.current,
  }
}
function addGasMargin(arg0: bigint): any {
  throw new Error('Function not implemented.')
}
