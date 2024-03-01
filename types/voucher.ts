import { z } from 'zod'

export const VoucherSchema = z.object({
  data: z.object({
    contract: z.string(),
    minter: z.string(),
    network_id: z.number(),
    signature: z.string(),
    voucher: z.object({
      currency: z.string(),
      expiry: z.number(),
      initial_recipient: z.string(),
      initial_recipient_amount: z.string(),
      net_recipient: z.string(),
      nonce: z.number(),
      price: z.string(),
      quantity: z.number(),
      token_id: z.string(),
      token_uri: z.string().nullable(),
    }),
  }),
  expires_at: z.string(),
  id: z.string(),
})

export type Voucher = z.infer<typeof VoucherSchema>
