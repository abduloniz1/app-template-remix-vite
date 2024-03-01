import { CheckCircle2, WalletIcon } from 'lucide-react'
import { MintTransactionState } from 'types/mint-transaction'
import LoadingIcon from '@/assets/icons/loading-icon'

interface GlobalStepIndicatorProps {
  transactionState: MintTransactionState
}

const GlobalStepIndicator = ({
  transactionState,
}: GlobalStepIndicatorProps) => {
  let icon = null
  let label = ''

  console.log('Transaction State:', transactionState.status)
  switch (transactionState.status) {
    case 'start-mint-session':
      icon = <LoadingIcon className="h-5 w-5 text-red-500" />
      label = 'Initializing Mint Session'
      break
    case 'mint-session-in-progress':
      icon = <LoadingIcon className="h-5 w-5 animate-spin text-yellow-500" />
      label = 'Reserving NFT(s) '
      break
    case 'mint-session-complete':
      icon = <CheckCircle2 className="h-5 w-5 text-green-500" />
      label = 'NFT(s) Successfully Reserved'
      break
    case 'transaction-approve':
      icon = <WalletIcon className="h-5 w-5 text-red-500" />
      label = 'Approve in wallet'
      break
    case 'transaction-approve-progress':
      icon = <LoadingIcon className="h-5 w-5 animate-spin text-yellow-500" />
      label = 'Approval pending'
      break
    case 'transaction-approve-complete':
      icon = <CheckCircle2 className="h-5 w-5 text-green-500" />
      label = 'Approval complete'
      break
    case 'transaction-start':
      icon = <WalletIcon className="h-5 w-5 text-red-500" />
      label = 'Confirm in wallet'
      break
    case 'transaction-confirm':
      icon = <LoadingIcon className="animate-spin" />
      label = 'Confirm in wallet'
      break
    case 'transaction-pending':
      icon = <LoadingIcon className="animate-spin" />
      label = 'Minting'
      break
    case 'transaction-confirmed':
      icon = <LoadingIcon className="animate-spin" />
      label = 'Mint Pending'
      break
    case 'transaction-complete':
      icon = <CheckCircle2 className="h-5 w-5 text-green-500" />
      label = 'Mint successful'
      break
    case 'transaction-hash':
      icon = <CheckCircle2 className="h-5 w-5 text-green-500" />
      label = 'Transaction Hash'
      break
    case 'idle':
      break
  }

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full bg-primary-800 p-1.5`}
      >
        {icon}
      </div>
      <span className="font-regular text-sm text-primary-300">{label}</span>
    </div>
  )
}

export default GlobalStepIndicator
