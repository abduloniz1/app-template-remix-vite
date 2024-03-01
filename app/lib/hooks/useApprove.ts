import { sepolia } from 'viem/chains'
import { useContractWriteAndWait } from './useContractWriteAndWait'
import { useERC20Contract } from './useERC20'

export const useApprove = () => {
  const mintVoucherContract = useERC20Contract(sepolia.id)

  return useContractWriteAndWait({
    ...mintVoucherContract,
    functionName: 'approve',
  })
}
