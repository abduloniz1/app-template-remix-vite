import { z } from 'zod'

export type PurchaseProvider =
  | 'STRIPE'
  | 'COINBASE'
  | 'MINT_VOUCHER'
  | 'EMAIL_CLAIM'
  | 'BETA_FREE_MINT'
