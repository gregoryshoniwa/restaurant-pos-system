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
  environment: "live" | "dev"
}

type Environment = "live" | "dev"

interface AuthContextType {
  authState: AuthState
  environment: Environment
  setEnvironment: (env: Environment) => void
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const API_URLS = {
  live: "https://live.npg.co.zw",
  dev: "https://dev.npg.co.zw"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [environment, setEnvironment] = useState<Environment>("live")
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false,
    environment: "live"
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
      const response = await fetch(`${API_URLS[environment]}/api/v1/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || `Authentication failed: ${response.status}`)
      }

      const newAuthState: AuthState = {
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
        environment
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
      environment: "live"
    })
    localStorage.removeItem("auth")
  }

  return (
    <AuthContext.Provider
      value={{
        authState,
        environment,
        setEnvironment,
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
