import { z } from 'zod'

export type ListingStatus =
  | 'ACTIVE'
  | 'CANCELLED'
  | 'COMPLETE'
  | 'PENDING_TX'
  | null

// create a zod schema for the listing object
export const ListingSchema = z.object({
  campaign_id: z.string().nullable(),
  collection_id: z.string(),
  currency: z.string(),
  end_time: z.string().nullable(),
  id: z.string(),
  item_id: z.string().nullable(),
  max_quantity_per_tx: z.number(),
  payment_providers: z.array(z.string()),
  policy: z.object({
    email_addresses: z.array(z.string()).nullable(),
    email_claim_duration: z.string().nullable(),
    eth_addresses: z.array(z.string()).nullable(),
    item_assignment_strategy: z.string(),
    max_per_user: z.number().nullable(),
    payment_session_duration: z
      .object({
        provider_override: z.string().nullable(),
        timeout_seconds: z.number(),
      })
      .nullable(),
    tx_payer: z.string(),
    type: z.string(),
  }),
  price: z.string(),
  quantity_listed: z.number(),
  quantity_remaining: z.number(),
  sale_type: z.string(),
  settlement_currency: z.object({
    MINT_VOUCHER: z.string(),
  }),
  start_time: z.string(),
  status: z.string().nullable(),
})

// create a type from the schema
export type Listing = z.infer<typeof ListingSchema>

// create a zod schema for the listings object
export const ListingsSchema = z.object({
  cursor: z.string(),
  has_more: z.boolean(),
  results: z.array(ListingSchema),
  total_results: z.number(),
})

// create a type from the schema
export type Listings = z.infer<typeof ListingsSchema>

export const ListingEligibilitySchema = z.object({
  is_eligible: z.boolean(),
  quantity_allowed: z.string(),
  quantity_claimed: z.string(),
})

export type ListingEligibility = z.infer<typeof ListingEligibilitySchema>
