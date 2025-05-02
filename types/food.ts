export type FoodType = "Veg" | "Non Veg"

export interface FoodItem {
  id: string
  image: string
  title: string
  price: number
  discount?: number
  type: FoodType
  category: string
}
