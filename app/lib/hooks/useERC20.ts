import { getContract } from 'viem'
import { sepolia } from 'viem/chains'
import { usePublicClient, type Address, erc20ABI } from 'wagmi'
import { WETH_CONTRACT_ADDRESS } from '../utils/constants'

export const WETH_ADDRESS: Record<number, string> = {
  [sepolia.id]: WETH_CONTRACT_ADDRESS,
}

export const getERC20ContractConfig = (chainId?: number) => ({
  address: (chainId && chainId in WETH_ADDRESS
    ? WETH_ADDRESS[chainId]
    : '') as Address,
  abi: erc20ABI,
})

export function useERC20Contract(chainId?: number) {
  const publicClient = usePublicClient({ chainId })

  return getContract({
    ...getERC20ContractConfig(chainId || publicClient.chain.id),
    publicClient,
  })
}
