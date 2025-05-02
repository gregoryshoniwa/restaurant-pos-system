"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  fullName: string
  email: string
  companyName: string
  role: string
  user_id: number
}

interface AuthState {
  token: string | null
  refreshToken: string | null
  user: User | null
  isAuthenticated: boolean
}

interface AuthContextType {
  authState: AuthState
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false,
  })

  // Load auth state from localStorage on initial render
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth")
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth)
        setAuthState(parsedAuth)
      } catch (error) {
        console.error("Failed to parse stored auth data:", error)
        localStorage.removeItem("auth")
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("https://live.npg.co.zw/api/v1/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`)
      }

      const data = await response.json()

      const newAuthState = {
        token: data.token,
        refreshToken: data.refreshToken,
        user: {
          fullName: data.fullName,
          email: data.email,
          companyName: data.companyName,
          role: data.role,
          user_id: data.user_id,
        },
        isAuthenticated: true,
      }

      setAuthState(newAuthState)

      // Save to localStorage
      localStorage.setItem("auth", JSON.stringify(newAuthState))

      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    setAuthState({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    })
    localStorage.removeItem("auth")
  }

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
