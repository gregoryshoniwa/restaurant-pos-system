"use client"

import { Header } from "@/components/header"
import { CategoryFilter } from "@/components/category-filter"
import { FoodGrid, foodItems } from "@/components/food-grid"
import { Cart } from "@/components/cart"
import { Toaster } from "@/components/ui/toaster"
import { useState } from "react"

export default function POSPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="h-screen bg-gray-100">
      <div className="flex flex-col h-full overflow-hidden">
        <Header title="POS System" onSearch={(query) => setSearchQuery(query)} />
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-auto p-4">
            <CategoryFilter
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              foodItems={foodItems}
            />
            <FoodGrid activeCategory={activeCategory} searchQuery={searchQuery} />
          </main>
          <Cart />
        </div>
      </div>
      <Toaster />
    </div>
  )
}
