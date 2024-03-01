import { sessionStorage } from '@/lib/services/session.server'
import { redirect } from '@remix-run/node'
import { DIDSession } from 'did-session'
import { Authenticator } from 'remix-auth'
import type { User } from 'types/user'
import { FormStrategy } from '../utils/auth-strategy'
import { invariant } from '../utils/misc'

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<User>(sessionStorage, {
  sessionKey: '_session',
  sessionErrorKey: '_session_error',
})

authenticator.use(
  new FormStrategy(async ({ form }) => {
    let didSession = form.get('didSession')
    let wallet = form.get('wallet')
    // Validate the inputs
    invariant(
      typeof didSession === 'string',
      'DID Session must be a serialized string',
    )
    invariant(didSession.length > 0, 'DID Session must not be empty')
    invariant(typeof wallet === 'string', 'Wallet must be a string')
    invariant(wallet.length > 0, 'Wallet must not be empty')

    // login the user
    let user = await authenticate(didSession, wallet)
    return user
  }),
  'auth',
)

export async function authenticate(
  didSession: string,
  wallet: string,
): Promise<User> {
  const session = await DIDSession.fromSession(didSession)
  if (!session.hasSession || session.isExpired) {
    throw new Error('Error: Invalid DID Session')
  }
  // and compare it with the wallet passed
  const derivedWallet = session.id.split(':')[4]
  if (derivedWallet !== wallet) {
    throw new Error('Error: Wallet does not match the DID Session')
  }

  // TODO: Check if the user is an admin.
  const adminAddresses = [
    '0x555E8A0E3956D685552dd92b404377B1FA69126E',
    '0x25709998B542f1Be27D19Fa0B3A9A67302bc1b94',
    '0x025f38acB8D005e2aF8CD4A5249ccF5cEf99774b',
    '0xf8621e8B829a010f333729F03B69700756F436Ba',
    '0x2593427Ec753F2d93560c76BE61e91ad3B4D0c68', //joji dev 1
    '0x6b466d9492Dc28FC4a83454d335E53e1a7Dd910D',
  ]

  // check if the wallet is an admin
  const isAdmin = adminAddresses.includes(wallet)
  if (!isAdmin) {
    throw new Error('Error: User is not an admin')
  }
  return {
    didSession,
    wallet,
  }
}

export async function login(request: Request) {
  await authenticator.authenticate('auth', request, {
    successRedirect: '/app',
  })
}

export async function logout(request: Request) {
  await authenticator.logout(request, { redirectTo: '/login' })
}

export const requireAuthedUser = async <TRequest extends Request>(
  request: TRequest,
) => {
  const user = await authenticator.isAuthenticated(request)
  if (!user) {
    throw redirect('/login', 302)
  }
  return user
}

export async function isAuthedUser(request: Request) {
  const user = await authenticator.isAuthenticated(request)
  if (user) return await Promise.resolve(user)
  return null
}
