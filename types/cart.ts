import { FoodType } from "./food"

export interface CartItem {
  id: string
  image: string
  title: string
  price: number
  type: FoodType
  quantity: number
}

export interface CartState {
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
}
