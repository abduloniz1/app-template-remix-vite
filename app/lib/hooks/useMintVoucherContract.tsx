import { mintVoucherABI } from '@/lib/abis/mintVoucher'
import { getContract } from 'viem'
import { sepolia } from 'viem/chains'
import { usePublicClient, type Address } from 'wagmi'
import { NFT_CONTRACT_ADDRESS } from '../utils/constants'

export const NFT_ADDRESS: Record<number, string> = {
  [sepolia.id]: NFT_CONTRACT_ADDRESS,
}

export const getMintVoucherContractConfig = (chainId?: number) => ({
  address: (chainId && chainId in NFT_ADDRESS
    ? NFT_ADDRESS[chainId]
    : '') as Address,
  abi: mintVoucherABI,
})

export function useMintVoucherContract(chainId?: number) {
  const publicClient = usePublicClient({ chainId })

  return getContract({
    ...getMintVoucherContractConfig(chainId || publicClient.chain.id),
    publicClient,
  })
}
