import { z } from 'zod'

const CollectionSchema = z.object({
  base_uri: z.string(),
  contract: z.string(),
  description: z.string(),
  id: z.string(),
  max_supply: z.number(),
  media: z.object({
    header_image_url: z.string().nullable(),
    thumbnail_image_url: z.string(),
  }),
  name: z.string(),
  network_id: z.number(),
  soulbound: z.boolean(),
})

export type Collection = z.infer<typeof CollectionSchema>

const CollectionStatsSchema = z.object({
  attributes: z.array(
    z.object({
      count: z.number(),
      name: z.string(),
      values: z.array(
        z.object({
          count: z.number(),
          name: z.string(),
        }),
      ),
    }),
  ),
  excluded: z.array(z.string()),
  tokens_indexed: z.number(),
})

export type CollectionStats = z.infer<typeof CollectionStatsSchema>
