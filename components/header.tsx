"use client"

import type React from "react"

import { Search, LogIn, LogOut, DollarSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { LoginDialog } from "./login-dialog"
import { useCurrency } from "@/context/currency-context"

interface HeaderProps {
  title: string
  onSearch?: (query: string) => void
}

export function Header({ title, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { authState, logout } = useAuth()
  const { currency, toggleCurrency } = useCurrency()
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    if (onSearch) {
      onSearch(query)
    }
  }

  // Get user initials for avatar
  const getInitials = (name: string) => {
    if (!authState.isAuthenticated) return "PL"
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const userName = authState.user?.fullName || "Please Login"
  const userInitials = getInitials(userName)

  return (
    <div className="bg-white p-4 flex items-center gap-4 border-b">
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search..."
          className="pl-10 w-full"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="font-medium"
          onClick={toggleCurrency}
        >
          <DollarSign className="h-4 w-4 mr-1" />
          {currency}
        </Button>
        {authState.isAuthenticated ? (
          <Button
            variant="ghost"
            size="icon"
            title="Logout"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            title="Login"
            onClick={() => setShowLoginDialog(true)}
          >
            <LogIn className="h-5 w-5" />
          </Button>
        )}
        <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-600 font-medium">{userInitials}</span>
          </div>
          <span className="text-sm font-medium">{userName}</span>
        </div>
      </div>
    </div>
  )
}
