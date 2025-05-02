"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { CartItem, CartState } from "@/types/cart"
import { FoodType } from "@/types/food"

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  increaseQuantity: (id: string) => void
  decreaseQuantity: (id: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex((item) => item.id === newItem.id)

      if (existingItemIndex >= 0) {
        // Item exists, increase quantity
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += 1
        return updatedItems
      } else {
        // Item doesn't exist, add new item with quantity 1
        return [...prevItems, { ...newItem, quantity: 1 }]
      }
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const increaseQuantity = (id: string) => {
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)))
  }

  const decreaseQuantity = (id: string) => {
    setItems(
      (prevItems) =>
        prevItems
          .map((item) => (item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item))
          .filter((item) => !(item.id === id && item.quantity === 1)), // Remove if quantity becomes 0
    )
  }

  const clearCart = () => {
    setItems([])
  }

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.05 // 5% tax
  const total = subtotal + tax

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        subtotal,
        tax,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export type { CartItem }
