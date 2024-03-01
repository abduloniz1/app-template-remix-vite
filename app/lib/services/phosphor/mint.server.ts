import {
  apiPrivateGET,
  apiPublicGET,
  apiPublicPOST,
} from '@/lib/utils/http-requests'
import process from 'node:process'
import { Voucher } from 'types/voucher'

export async function createPurchaseIntent(
  eth_address: `0x${string}`,
  listing_id: string,
  quantity: number,
): Promise<Voucher> {
  console.log('ENTER CREATE_PURCHASE_INTENT', eth_address, listing_id, quantity)
  const body = {
    buyer: {
      eth_address: eth_address,
    },
    listing_id: listing_id,
    quantity: quantity,
    provider: 'MINT_VOUCHER',
  }
  const data = await apiPublicPOST<any>(`/v1/purchase-intents`, body)
  return data
}

export async function getPendingMintVouchers(
  eth_address: `0x${string}`,
  contract_address?: `0x${string}`,
  network_id?: number,
): Promise<any> {
  const queryParams = [
    contract_address ? `contract_address=${contract_address}` : '',
    network_id ? `network_id=${network_id}` : '',
  ]
    .filter(Boolean)
    .join('&')
  const data = await apiPublicGET<any>(
    `/v1/mint-vouchers/${eth_address}?${queryParams}`,
  )
  return data
}

export async function getNumTotalPendingVouchers(
  listing_address?: string,
  status?: string,
): Promise<number> {
  const queryParams = [
    listing_address ? `listing_address=${listing_address}` : '',
    status ? `status=${status}` : '',
  ]
    .filter(Boolean)
    .join('&')
  const data = await apiPrivateGET<any>(`/v1/purchase-intents?${queryParams}`)
  console.log('FETCHED PENDING VOUCHERS: ', data.results)
  return data.results.length
}

export async function getVoucherMintedItem(
  purchase_intent_id?: string,
): Promise<any> {
  const data = await apiPrivateGET<any>(
    `/v1/purchase-intents/${purchase_intent_id}/items`,
  )
  console.log('FETCHED PENDING VOUCHERS: ', data.results)
  if (data.results.length > 0) {
    return data.results[0]
  }
  return null
}

export async function getItemMetadataByTokenId(token_id: string): Promise<any> {
  const data = await apiPublicGET<any>(
    `/v1/metadata/${process.env.PHOSPHOR_COLLECTION_ID}/${token_id}`,
  )
  if (data !== undefined) {
    return data
  }
  return null
}

export async function getItemDataByTokenId(token_id: string): Promise<any> {
  const data = await apiPrivateGET<any>(
    `/v1/items?collection_id=${process.env.PHOSPHOR_COLLECTION_ID}&token_id=${token_id}`,
  )

  if (data.results.length > 0) {
    return data.results
  }
  return null
}
