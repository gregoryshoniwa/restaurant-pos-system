"use client"

import { Card } from "@/components/ui/card"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { useCurrency, formatPrice } from "@/context/currency-context"

interface FoodCardProps {
  id: string
  image: string
  title: string
  price: number
  discount?: number
  type: "Veg" | "Non Veg"
  category: string
}

export function FoodCard({ id, image, title, price, discount, type, category }: FoodCardProps) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const { currency, rate } = useCurrency()

  const handleAddToCart = () => {
    addItem({ id, image, title, price, type })

    toast({
      title: "Added to cart",
      description: title,
    })
  }

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]"
      onClick={handleAddToCart}
    >
      <div className="relative">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-40 object-cover" />
        {discount && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded-md text-xs font-medium">
            {discount}% Off
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium mb-1">{title}</h3>
        <div className="flex justify-between items-center">
          <span className="text-green-600 font-bold">{formatPrice(price, currency, rate)}</span>
          <div className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${type === "Veg" ? "bg-green-500" : "bg-red-500"}`}></span>
            <span className="text-xs text-gray-500">{type}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
