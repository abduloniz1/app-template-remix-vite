import { type GetContractReturnType } from 'viem'
import { sepolia } from 'viem/chains'
import { useMintVoucherContract } from './useMintVoucherContract'
import { useContractWriteAndWait } from './useContractWriteAndWait'

export const useCancelVoucher = () => {
  const mintVoucherContract = useMintVoucherContract(sepolia.id)

  return useContractWriteAndWait({
    ...mintVoucherContract,
    functionName: 'cancelVoucher',
  })
}
