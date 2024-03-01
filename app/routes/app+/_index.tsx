import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Counter from '@/components/ui/counter'
import { isAuthedUser } from '@/lib/services/auth.server'
import {
  getCollectionListings,
  getListingById,
  getOrganizationListings,
  patchListing,
} from '@/lib/services/phosphor/listing.server'
import { CURRENT_LISTING_FCFS } from '@/lib/utils/constants'
import { ActionFunctionArgs, LoaderFunction, json } from '@remix-run/node'
import {
  Form,
  useActionData,
  useLoaderData,
  useRevalidator,
} from '@remix-run/react'
import { useForm } from '@conform-to/react'

import { parseWithZod } from '@conform-to/zod'
import { formatEther, isAddress } from 'viem'

import { Listing } from 'types/listing'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import useRevalidateOnInterval from '@/lib/hooks/useRevalidate'

const schema = z.object({
  address: z.string().refine((value) => isAddress(value), {
    message:
      'Provided address is invalid. Please insure you have typed correctly.',
  }),
  listing_id: z.string(),
})

export const loader: LoaderFunction = async ({ request }) => {
  const user = await isAuthedUser(request)
  const url = new URL(request.url)
  const voucher_id = url.searchParams.get('voucher_id')
  const token_id = url.searchParams.get('token_id')

  const listing = await getListingById(CURRENT_LISTING_FCFS)
  const listings = await getCollectionListings(
    process.env.PHOSPHOR_COLLECTION_ID!,
  )

  const activeOrgListings = await getOrganizationListings(
    process.env.PHOSPHOR_COLLECTION_ID,
  )
  const activeEntries = activeOrgListings.filter(
    (item) => item.status !== 'CANCELLED',
  )
  console.log(activeEntries)
  const totals = activeEntries.reduce(
    (acc, current) => {
      acc.totalListed += current.quantity_listed
      acc.totalRemaining += current.quantity_remaining
      return acc
    },
    { totalListed: 0, totalRemaining: 0 },
  )
  console.log(totals)
  return json({
    user,
    listing,
    listings,
    totals,
  })
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema })

  if (submission.status !== 'success') {
    return json(submission.reply())
  }
  console.log('submission', submission.value)
  // Add the address to the listing policy
  let listing = await getListingById(submission.value.listing_id)
  if (listing.policy.type === 'ALLOW_LIST') {
    // create a set of eth addresses
    let eth_addresses = new Set(listing.policy.eth_addresses)
    eth_addresses.add(submission.value.address)
    listing.policy.eth_addresses = Array.from(eth_addresses)
    console.log('Mutated listing', listing)

    const policy = {
      policy: {
        eth_addresses: listing.policy.eth_addresses,
        type: listing.policy.type,
      },
    }

    // update the listing
    const resp = await patchListing(listing.id, policy)
    console.log('RESP', resp)
  }
  console.log('Mutated listing', listing)

  return json({})
}

export default function IndexRoute() {
  const { user, listing, listings, totals } = useLoaderData<typeof loader>()
  const { revalidate } = useRevalidator()
  console.log('Refresh')
  return (
    <div className="mt-16 flex h-full w-full flex-col items-center gap-8">
      <Card className="flex w-[92vw] max-w-[728px] flex-col items-center justify-center gap-8 p-16 text-center">
        <div className="w-full space-y-8">
          <h4 className="text-3xl font-semibold leading-none">
            Admin Dashboard
          </h4>
          <div className="flex w-full flex-row items-center justify-center gap-12">
            <div className="flex flex-col items-center gap-4">
              <div className="font-semibold">Total Remaining</div>
              <Counter
                digits={totals.totalRemaining.toString().length}
                value={totals.totalRemaining}
              />
            </div>
            <div className="h-full w-[1px] border-gray-200 border-opacity-20" />
            <div className="flex flex-col items-center gap-4">
              <div className="font-semibold">Total Listings Supply</div>
              <Counter
                digits={totals.totalListed.toString().length}
                value={totals.totalListed}
              />
            </div>
          </div>
          <div className="flex w-full flex-row items-center justify-center">
            <Button variant={'secondary'} onClick={revalidate}>
              Refresh
            </Button>
          </div>
        </div>
      </Card>
      <div className="w-full max-w-7xl p-8">
        <div className="flex w-full items-center justify-between">
          <h4 className="text-3xl font-semibold leading-none">Listings</h4>
        </div>
        {/* Iterate over listings */}
        {listings.map((listing: Listing, index: number) => (
          <div key={listing.id} className="mb-12 mt-8">
            <div className="flex w-full items-center justify-between">
              <h5 className="flex items-center gap-2 text-xl font-semibold">
                <span>{listing.policy.type}</span>{' '}
                <span className="text-primary-500">{listing.id}</span>{' '}
                <Badge>{formatEther(BigInt(listing.price))} ETH</Badge>
              </h5>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-8">
              <div className="flex flex-col items-center gap-4">
                <Card className="flex w-full items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="font-semibold opacity-60">Total Supply</div>
                    <div className="flex">
                      <Counter digits={3} value={listing.quantity_listed} />
                    </div>
                  </div>
                </Card>
              </div>
              <div className="flex flex-col items-center gap-4">
                <Card className="flex w-full items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="font-semibold opacity-60">Total Minted</div>
                    <div className="flex">
                      <Counter
                        digits={3}
                        value={
                          listing.quantity_listed - listing.quantity_remaining
                        }
                      />
                    </div>
                  </div>
                </Card>
              </div>
              <div className="flex flex-col items-center gap-4">
                <Card className="flex w-full items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="font-semibold opacity-60">
                      Total Remaining
                    </div>
                    <div className="flex">
                      <Counter digits={3} value={listing.quantity_remaining} />
                    </div>
                  </div>
                </Card>
              </div>
              <div className="flex flex-col items-center gap-4">
                <Card className="flex h-full w-full items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="font-semibold opacity-60">Status</div>
                    <div className="text-xl font-semibold text-white">
                      {listing.status}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            {
              // If the listing is an allow list, display the addresses
              listing.policy.type === 'ALLOW_LIST' && (
                <div className="mt-4 px-16">
                  <div className="font-semibold">Addresses</div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">#</TableHead>
                        <TableHead className="font-semibold">Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listing.policy.eth_addresses?.length &&
                        listing.policy.eth_addresses?.map(
                          (address: string, index: number) => (
                            <TableRow key={`${address}-${index}`}>
                              <TableCell className="font-medium opacity-60">
                                {index + 1}
                              </TableCell>
                              <TableCell className="font-semibold">
                                {address}
                              </TableCell>
                            </TableRow>
                          ),
                        )}
                    </TableBody>
                  </Table>
                  <ListingForm listing_id={listing.id} />
                </div>
              )
            }
            <hr className="my-12  opacity-20" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ListingForm({ listing_id }: { listing_id: string }) {
  const lastResult = useActionData<typeof action>()
  const [form, fields] = useForm({
    // Sync the result of last submission
    lastResult,
    id: listing_id,
    // Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema })
    },

    // Validate the form on blur event triggered
    shouldValidate: 'onBlur',
  })
  return (
    <Form
      method="post"
      id={form.id}
      onSubmit={form.onSubmit}
      className="space-y-2"
    >
      <div className="flex items-center gap-4">
        <div>
          <Input
            type="address"
            name={fields.address.name}
            className="w-[40vw]"
          />
        </div>
        <div>
          <input
            type="listing_id"
            name={fields.listing_id.name}
            value={listing_id}
            readOnly
            hidden
          />
          <div>{fields.listing_id.errors}</div>
        </div>
        <Button type="submit" variant="secondary">
          Add Address
        </Button>
      </div>
      <div className="text-red-500">{fields.address.errors}</div>
    </Form>
  )
}
