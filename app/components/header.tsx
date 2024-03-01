import { Await, Link, useFetcher } from '@remix-run/react'
import IntuitionLogotype from '@/assets/intuition-logotype'
import { useAccount, useDisconnect } from 'wagmi'
import templateBadge from '@images/NFT-badge.png'
import { AccountButton } from './account-button'
import { User } from 'types/user'
import { ConnectButton } from './connect-button'
import { ClientOnly } from 'remix-utils/client-only'

export interface HeaderProps {
  user: User | null
}

export default function Header({ user }: HeaderProps) {
  const fetcher = useFetcher()
  const { disconnect } = useDisconnect()
  const { isConnected } = useAccount()

  async function handleSignout() {
    disconnect()
    fetcher.submit({}, { method: 'post', action: '/actions/auth/logout' })
  }
  return (
    <div className="flex w-full max-w-7xl items-center justify-between">
      <div>
        <Link to="/">
          <div className="flex items-center gap-4">
            <IntuitionLogotype />
            <img
              src={templateBadge}
              alt="Intuition App Template"
              className="h-6 w-auto shadow-md"
            />
          </div>
        </Link>
      </div>
      <ClientOnly fallback={<div className="h-12" />}>
        {() => (
          <div className="h-12">
            {user?.wallet && isConnected ? (
              <AccountButton
                handleSignOut={handleSignout}
                user={user}
                size="lg"
              />
            ) : (
              <ConnectButton size="lg" user={user} />
            )}
          </div>
        )}
      </ClientOnly>
    </div>
  )
}
