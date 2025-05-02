"use client"

import { Grid, Coffee, Soup, UtensilsCrossed, ChefHat, Sandwich } from "lucide-react"
import { useMemo } from "react"

interface CategoryFilterProps {
  activeCategory: string
  setActiveCategory: (category: string) => void
  foodItems: any[]
}

export function CategoryFilter({ activeCategory, setActiveCategory, foodItems }: CategoryFilterProps) {
  // Calculate the number of items in each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: foodItems.length,
      breakfast: 0,
      soups: 0,
      pasta: 0,
      "main-course": 0,
      burgers: 0,
    }

    foodItems.forEach((item) => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++
      }
    })

    return counts
  }, [foodItems])

  const categories = [
    { icon: Grid, label: "All", id: "all", items: `${categoryCounts.all} Items` },
    { icon: Coffee, label: "Breakfast", id: "breakfast", items: `${categoryCounts.breakfast} Items` },
    { icon: Soup, label: "Soups", id: "soups", items: `${categoryCounts.soups} Items` },
    { icon: UtensilsCrossed, label: "Pasta", id: "pasta", items: `${categoryCounts.pasta} Items` },
    { icon: ChefHat, label: "Main Course", id: "main-course", items: `${categoryCounts["main-course"]} Items` },
    { icon: Sandwich, label: "Burgers", id: "burgers", items: `${categoryCounts.burgers} Items` },
  ]

  return (
    <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
      {categories.map((category) => (
        <div
          key={category.id}
          className={`flex flex-col items-center p-3 rounded-xl min-w-[100px] ${
            activeCategory === category.id ? "bg-green-50 text-green-600" : "bg-white"
          } border cursor-pointer hover:bg-green-50 transition-colors`}
          onClick={() => setActiveCategory(category.id)}
        >
          <category.icon className="h-6 w-6 mb-1" />
          <span className="text-sm font-medium">{category.label}</span>
          <span className="text-xs text-gray-500">{category.items}</span>
        </div>
      ))}
    </div>
  )
}
