import { parseWithZod } from '@conform-to/zod'
import { json, type ActionFunctionArgs } from '@remix-run/node'
import { z } from 'zod'
import { Intent } from '@conform-to/dom'
import { createPurchaseIntent } from '@/lib/services/phosphor/mint.server'

export function createPurchaseIntentSchema(intent: Intent | null) {
  return z.object({
    eth_address: z.string(),
    listing_id: z.string(),
    quantity: z.number().int().positive(),
  })
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  console.log(formData)
  const submission = await parseWithZod(formData, {
    schema: (intent) => createPurchaseIntentSchema(intent),
    async: true,
  })

  /**
   * The submission status could be either "success", "error" or undefined
   * If the status is undefined, it means that the submission is not ready (i.e. `intent` is not `submit`)
   */
  if (submission.status !== 'success') {
    console.log(submission.status)
    return json(submission.reply(), {
      // You can also use the status to determine the HTTP status code
      status: submission.status === 'error' ? 400 : 200,
    })
  }

  const { eth_address, listing_id, quantity } = submission.value
  console.log(eth_address, listing_id, quantity)
  const resp = await createPurchaseIntent(
    eth_address as `0x${string}`,
    listing_id,
    quantity,
  )
  console.log('RESPONSE BACK: ', resp)
  // zod schema parse resp from VoucherSchema
  // if the voucher is not valid, return the submission with formErrors
  // if the voucher is valid, return the submission with resetForm

  if (!resp.data || !resp.data.voucher || !resp.data.signature) {
    return json(
      submission.reply({
        // You can also pass additional error to the `reply` method
        formErrors: ['Failed to create mint session'],
        hideFields: ['listing_id', 'provider'],
      }),
    )
  }
  if (resp.data.voucher && resp.data.signature) {
    return resp
  }

  // Reply the submission with `resetForm` option
  return json(submission.reply({ resetForm: false }))
}
