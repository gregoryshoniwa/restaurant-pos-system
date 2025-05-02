"use client"

import { FoodCard } from "./food-card"

// Food items with real images and categories
export const foodItems = [
  {
    id: "food-1",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
    title: "Tasty Vegetable Salad Healthy Diet",
    price: 4.99,
    discount: 20,
    type: "Veg",
    category: "breakfast",
  },
  {
    id: "food-2",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop",
    title: "Original Chess Meat Burger With Chips",
    price: 4.50,
    type: "Non Veg",
    category: "burgers",
  },
  {
    id: "food-3",
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=1964&auto=format&fit=crop",
    title: "Tacos Salsa With Chickens Grilled",
    price: 3.99,
    type: "Non Veg",
    category: "main-course",
  },
  {
    id: "food-4",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=1887&auto=format&fit=crop",
    title: "Fresh Orange Juice With Basil Seed",
    price: 2.99,
    type: "Veg",
    category: "breakfast",
  },
  {
    id: "food-5",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop",
    title: "Meat Sushi Maki With Tuna",
    price: 3.50,
    type: "Non Veg",
    category: "main-course",
  },
  {
    id: "food-6",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop",
    title: "Original Cheese Burger With Fries",
    price: 4.25,
    discount: 20,
    type: "Veg",
    category: "burgers",
  },
  {
    id: "food-7",
    image: "https://images.unsplash.com/photo-1604152135912-04a022e23696?q=80&w=1887&auto=format&fit=crop",
    title: "Creamy Tomato Soup",
    price: 2.75,
    type: "Veg",
    category: "soups",
  },
  {
    id: "food-8",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=2070&auto=format&fit=crop",
    title: "Spaghetti Bolognese",
    price: 4.75,
    type: "Non Veg",
    category: "pasta",
  },
  {
    id: "food-9",
    image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?q=80&w=1992&auto=format&fit=crop",
    title: "Chicken Noodle Soup",
    price: 2.99,
    type: "Non Veg",
    category: "soups",
  },
]

interface FoodGridProps {
  activeCategory: string
  searchQuery: string
}

export function FoodGrid({ activeCategory, searchQuery }: FoodGridProps) {
  // Filter by category and search query
  const filteredItems = foodItems.filter((item) => {
    // Filter by category
    const categoryMatch = activeCategory === "all" || item.category === activeCategory

    // Filter by search query
    const searchMatch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase())

    return categoryMatch && searchMatch
  })

  return (
    <>
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <p className="text-center">No items found</p>
          <p className="text-center text-sm">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <FoodCard key={item.id} {...item} />
          ))}
        </div>
      )}
    </>
  )
}
