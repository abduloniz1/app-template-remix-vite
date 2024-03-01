export type MintTransactionState = {
  status: MintTransactionStatus
  txHash?: `0x${string}`
  error?: string
}

export type MintTransactionStatus =
  | 'idle'
  | 'start-mint-session'
  | 'mint-session-in-progress'
  | 'mint-session-complete'
  | 'transaction-approve'
  | 'transaction-approve-progress'
  | 'transaction-approve-complete'
  | 'transaction-start'
  | 'transaction-confirm'
  | 'transaction-pending'
  | 'transaction-confirmed'
  | 'transaction-complete'
  | 'transaction-hash'
  | 'error'

export type MintTransactionAction =
  | { type: 'START_MINT_SESSION' }
  | { type: 'MINT_SESSION_IN_PROGRESS' }
  | { type: 'MINT_SESSION_COMPLETE' }
  | { type: 'TRANSACTION_APPROVE' }
  | { type: 'TRANSACTION_APPROVE_PROGRESS' }
  | { type: 'TRANSACTION_APPROVE_COMPLETE' }
  | { type: 'TRANSACTION_START' }
  | { type: 'TRANSACTION_CONFIRM' }
  | { type: 'TRANSACTION_PENDING' }
  | { type: 'TRANSACTION_CONFIRMED' }
  | { type: 'TRANSACTION_COMPLETE'; txHash?: `0x${string}` }
  | { type: 'TRANSACTION_HASH'; txHash: `0x${string}` }
  | { type: 'TRANSACTION_ERROR'; error: string }

export const mintTransactionReducer = (
  state: MintTransactionState,
  action: MintTransactionAction,
): MintTransactionState => {
  switch (action.type) {
    case 'START_MINT_SESSION':
      return { ...state, status: 'start-mint-session' }
    case 'MINT_SESSION_IN_PROGRESS':
      return { ...state, status: 'mint-session-in-progress' }
    case 'MINT_SESSION_COMPLETE':
      return { ...state, status: 'mint-session-complete' }
    case 'TRANSACTION_APPROVE':
      return { ...state, status: 'transaction-approve' }
    case 'TRANSACTION_APPROVE_PROGRESS':
      return { ...state, status: 'transaction-approve-progress' }
    case 'TRANSACTION_APPROVE_COMPLETE':
      return { ...state, status: 'transaction-approve-complete' }
    case 'TRANSACTION_START':
      return { ...state, status: 'transaction-start' }
    case 'TRANSACTION_CONFIRM':
      return { ...state, status: 'transaction-confirm' }
    case 'TRANSACTION_PENDING':
      return { ...state, status: 'transaction-pending' }
    case 'TRANSACTION_CONFIRMED':
      return { ...state, status: 'transaction-confirmed' }
    case 'TRANSACTION_COMPLETE':
      return {
        ...state,
        status: 'transaction-complete',
        txHash: action.txHash,
      }
    case 'TRANSACTION_HASH':
      return { ...state, status: 'transaction-hash', txHash: action.txHash }
    case 'TRANSACTION_ERROR':
      return { ...state, status: 'error', error: action.error }
    default:
      return state
  }
}

export const initialTxState: MintTransactionState = {
  status: 'idle',
  txHash: `0x${1234}...`,
  error: undefined,
}
