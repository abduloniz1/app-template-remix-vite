import { createPublicClient, getContract, http } from 'viem'
import { mainnet, sepolia } from 'viem/chains'
import { MULTIVAULT_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS } from './constants'
import { mintVoucherABI } from '../abis/mintVoucher'

const alchemyRpcUrl = process.env.ALCHEMY_RPC_URL
const alchemyMainnetRpcUrl = process.env.ALCHEMY_MAINNET_RPC_URL

export const publicClient = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: sepolia,
  transport: http(alchemyRpcUrl),
})

export const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(alchemyMainnetRpcUrl),
})

export const getNFTContract = getContract({
  address: NFT_CONTRACT_ADDRESS,
  abi: mintVoucherABI,
  publicClient,
})

export const NFTContract = {
  address: NFT_CONTRACT_ADDRESS,
  abi: mintVoucherABI,
} as const
