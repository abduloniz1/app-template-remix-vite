import { type GetContractReturnType } from 'viem'
import { sepolia } from 'viem/chains'
import { useMintVoucherContract } from './useMintVoucherContract'
import { Voucher } from 'types/voucher'
import { useContractWriteAndWait } from './useContractWriteAndWait'

export const useMint = () => {
  const mintVoucherContract = useMintVoucherContract(sepolia.id)

  return useContractWriteAndWait({
    ...mintVoucherContract,
    functionName: 'mintWithVoucher',
  })
}

export const getVoucherArgs = (voucher: Voucher) => {
  const voucherArgs = [
    voucher?.data.voucher.net_recipient,
    voucher?.data.voucher.initial_recipient,
    voucher?.data.voucher.initial_recipient_amount,
    voucher?.data.voucher.quantity,
    voucher?.data.voucher.nonce,
    voucher?.data.voucher.expiry,
    voucher?.data.voucher.price,
    voucher?.data.voucher.token_id,
    voucher?.data.voucher.currency,
  ]
  const voucherSignature = voucher?.data.signature

  return [voucherArgs, voucherSignature]
}
