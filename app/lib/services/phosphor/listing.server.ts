// This file is for the collection service. This service is responsible for
// fetching phosphor collection details and collection stats

import {
  apiPrivatePATCH,
  apiPrivateGET,
  apiPrivatePOST,
  apiPublicGET,
  phosphorHeaders,
} from '@/lib/utils/http-requests'
import {
  Listing,
  ListingEligibility,
  ListingStatus,
  Listings,
} from 'types/listing'

export async function getOrganizationListings(
  collection_id?: string,
  status?: ListingStatus,
): Promise<Listing[]> {
  const queryParams = `collection_id=${collection_id}`

  const data = await apiPrivateGET<Listings>(
    `/v1/listings?${queryParams}`,
    phosphorHeaders,
  )

  if (status && data.results && data.results.length) {
    return data.results.filter((listing: any) => listing.status === status)
  }
  return data.results
}

export async function getListingById(listing_id: string): Promise<Listing> {
  const data = await apiPrivateGET<Listing>(
    `/v1/listings/${listing_id}`,
    phosphorHeaders,
  )
  console.log('LISTING BY ID', data)
  return data
}

export async function getAdminListingById(
  listing_id: string,
): Promise<Listing> {
  const data = await apiPrivateGET<Listing>(
    `/v1/listings/${listing_id}`,
    phosphorHeaders,
  )
  return data
}

export async function getListingEligibility(
  listing_id: string,
  address?: `0x${string}`,
): Promise<ListingEligibility> {
  // query params are listing_id, eth_address
  // if eth_address is provided, add it as a query param
  const path = `/v1/listings/redemption-eligibility`
  const queryParams = `listing_id=${listing_id}${
    address ? `&eth_address=${address}` : ''
  }`

  const data = await apiPublicGET<ListingEligibility>(
    `${path}?${queryParams}`,
    phosphorHeaders,
  )

  return data
}

export async function getCollectionListings(
  collection_id: string,
): Promise<Listing[]> {
  const data = await apiPrivateGET<Listings>(
    `/v1/listings?collection_id=${collection_id}`,
    phosphorHeaders,
  )
  return data.results
}

export async function patchListing(
  listing_id: string,
  body: any,
): Promise<Listing> {
  try {
    const data = await apiPrivatePATCH<Listing>(
      `/v1/listings/${listing_id}`,
      body,
      phosphorHeaders,
    )
    return data
  } catch (e) {
    console.error(e)
    throw e
  }
}
