import { z } from 'zod'

// create a zod schema for the item
const ItemSchema = z.object({
  id: z.string(),
  collection_id: z.string(),
  token_id: z.string(),
  token_status: z.string(),
  attributes: z.object({
    description: z.string(),
    image_url: z.string(),
    rarity: z.string(),
    resonance_frequency: z.number(),
    secret_code: z.string(),
    title: z.string(),
  }),
  media: z.object({
    image: z.object({
      full: z.string(),
      original: z.string(),
      thumb: z.string(),
      tiny: z.string(),
    }),
  }),
})

export type Item = z.infer<typeof ItemSchema>

const ItemAttributeSchema = z.object({
  trait_type: z.string(),
  value: z.union([z.string(), z.number()]),
})

const ItemMetadataSchema = z.object({
  attributes: z.array(ItemAttributeSchema),
  description: z.string(),
  image: z.string(),
  name: z.string(),
})

export type ItemMetadata = z.infer<typeof ItemMetadataSchema>
