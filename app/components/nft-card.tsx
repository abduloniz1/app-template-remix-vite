import { Card } from '@/components/ui/card'
import { Item } from 'types/item'

export default function NFTCard({ item }: { item: Item }) {
  return (
    <Card
      key="1"
      className="flex w-full max-w-md flex-col items-center space-y-4 rounded-xl bg-white/5 p-6 shadow-md"
    >
      <img
        alt="NFT Artwork"
        className="padding-4 h-64 w-full rounded-lg object-contain"
        src={item[0].attributes.image_url}
        style={{
          aspectRatio: '16/9',
        }}
      />
      <div className="flex flex-col items-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          {item[0].attributes.title}
        </h2>
      </div>
      <p className="text-center text-sm text-primary-400">
        {item[0].attributes.description} <br />
      </p>
    </Card>
  )
}
