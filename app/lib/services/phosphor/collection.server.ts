// This file is for the collection service. This service is responsible for
// fetching phosphor collection details and collection stats

import { apiPublicGET, phosphorHeaders } from '@/lib/utils/http-requests'
import { Collection, CollectionStats } from 'types/collection'

export async function getCollectionDetails(collection_id: string) {
  const data = await apiPublicGET<Collection>(
    `/v1/collections/${collection_id}`,
    phosphorHeaders,
  )

  return data
}

export async function getCollectionStats(collection_id: string) {
  const data = await apiPublicGET<CollectionStats>(
    `/v1/collections/${collection_id}/stats`,
    phosphorHeaders,
  )

  return data
}
