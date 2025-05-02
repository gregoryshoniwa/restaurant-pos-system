"use client"

import { Button } from "@/components/ui/button"
import { CreditCard, QrCode, Banknote, Trash2, Plus, Minus } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useCurrency, formatPrice } from "@/context/currency-context"
import { useAuth } from "@/context/auth-context"
import { LoginDialog } from "./login-dialog"

export function Cart() {
  const { items, removeItem, increaseQuantity, decreaseQuantity, clearCart, subtotal, tax, total } = useCart()
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const { toast } = useToast()
  const { authState } = useAuth()
  const { currency, rate } = useCurrency()

  const handlePlaceOrderClick = () => {
    if (!authState.isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to place an order",
        variant: "destructive",
      })
      setShowLoginDialog(true)
      return
    }
    
    if (!paymentMethod) {
      toast({
        title: "Select Payment Method",
        description: "Please choose your preferred payment method: Cash, Card, or QR Code",
        variant: "destructive",
        duration: 3000,
      })
      return
    }
    
    setIsOrderDialogOpen(true)
  }

  const generatePaymentToken = async () => {
    try {
      const baseUrl = authState.environment === 'dev' ? 'https://dev.npg.co.zw' : 'https://live.npg.co.zw'
      const response = await fetch(`${baseUrl}/api/v1/transaction/u/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify({
          amount: total.toFixed(2),
          currency: currency
        })
      })

      const data = await response.json()
      
      if (response.status === 401) {
        toast({
          title: "Session Expired",
          description: "Please login again to continue",
          variant: "destructive",
        })
        setShowLoginDialog(true)
        throw new Error("Session expired")
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate payment token')
      }

      return data.data.url
    } catch (error) {
      console.error('Payment token error:', error)
      throw error
    }
  }

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const paymentUrl = await generatePaymentToken()
      clearCart()
      setIsOrderDialogOpen(false)
      window.location.href = paymentUrl
    } catch (error) {
      if (error instanceof Error && error.message === "Session expired") {
        return // Login dialog is already shown
      }
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  return (
    <div className="w-[380px] bg-white border-l flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Current Order</h2>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <QrCode className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-center">Your cart is empty</p>
            <p className="text-center text-sm">Add items from the menu to get started</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 mb-4">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="text-sm font-medium">{item.title}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500 -mt-1 -mr-1"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-green-600 font-bold">{formatPrice(item.price, currency, rate)}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 rounded-full"
                      onClick={() => increaseQuantity(item.id)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t p-4">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Sub Total</span>
            <span>{formatPrice(subtotal, currency, rate)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax 5%</span>
            <span>{formatPrice(tax, currency, rate)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total Amount</span>
            <span>{formatPrice(total, currency, rate)}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <Button
            variant={paymentMethod === "Cash" ? "secondary" : "outline"}
            className={`relative flex flex-col items-center py-4 h-auto transition-all duration-200 ${
              paymentMethod === "Cash"
                ? "bg-green-50 text-green-600 border-green-200 shadow-md scale-[1.02] z-10"
                : "hover:bg-green-50/80 hover:text-green-600 hover:scale-[1.02] hover:shadow-md active:scale-100"
            }`}
            onClick={() => setPaymentMethod("Cash")}
          >
            <div 
              className={`p-3 rounded-full mb-2 transition-all duration-200 ${
                paymentMethod === "Cash" 
                  ? "bg-green-100 shadow-inner" 
                  : "bg-gray-50"
              }`}
            >
              <Banknote className={`h-6 w-6 transition-colors ${
                paymentMethod === "Cash" ? "text-green-600" : "text-gray-600"
              }`} />
            </div>
            <span className={`text-sm font-semibold transition-colors ${
              paymentMethod === "Cash" ? "text-green-600" : "text-gray-600"
            }`}>Cash</span>
          </Button>
          <Button
            variant={paymentMethod === "Card" ? "secondary" : "outline"}
            className={`relative flex flex-col items-center py-4 h-auto transition-all duration-200 ${
              paymentMethod === "Card"
                ? "bg-blue-50 text-blue-600 border-blue-200 shadow-md scale-[1.02] z-10"
                : "hover:bg-blue-50/80 hover:text-blue-600 hover:scale-[1.02] hover:shadow-md active:scale-100"
            }`}
            onClick={() => setPaymentMethod("Card")}
          >
            <div 
              className={`p-3 rounded-full mb-2 transition-all duration-200 ${
                paymentMethod === "Card" 
                  ? "bg-blue-100 shadow-inner" 
                  : "bg-gray-50"
              }`}
            >
              <CreditCard className={`h-6 w-6 transition-colors ${
                paymentMethod === "Card" ? "text-blue-600" : "text-gray-600"
              }`} />
            </div>
            <span className={`text-sm font-semibold transition-colors ${
              paymentMethod === "Card" ? "text-blue-600" : "text-gray-600"
            }`}>Card</span>
          </Button>
          <Button
            variant={paymentMethod === "QR Code" ? "secondary" : "outline"}
            className={`relative flex flex-col items-center py-4 h-auto transition-all duration-200 ${
              paymentMethod === "QR Code"
                ? "bg-purple-50 text-purple-600 border-purple-200 shadow-md scale-[1.02] z-10"
                : "hover:bg-purple-50/80 hover:text-purple-600 hover:scale-[1.02] hover:shadow-md active:scale-100"
            }`}
            onClick={() => setPaymentMethod("QR Code")}
          >
            <div 
              className={`p-3 rounded-full mb-2 transition-all duration-200 ${
                paymentMethod === "QR Code" 
                  ? "bg-purple-100 shadow-inner" 
                  : "bg-gray-50"
              }`}
            >
              <QrCode className={`h-6 w-6 transition-colors ${
                paymentMethod === "QR Code" ? "text-purple-600" : "text-gray-600"
              }`} />
            </div>
            <span className={`text-sm font-semibold transition-colors ${
              paymentMethod === "QR Code" ? "text-purple-600" : "text-gray-600"
            }`}>QR Code</span>
          </Button>
        </div>

        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
          onClick={handlePlaceOrderClick}
          disabled={items.length === 0}
        >
          Place Order
        </Button>
      </div>

      <Dialog 
        open={isOrderDialogOpen} 
        onOpenChange={(open) => {
          setIsOrderDialogOpen(open)
          if (!open) {
            setIsProcessing(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Order</DialogTitle>
            <DialogDescription>You are about to place an order.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <h3 className="font-medium mb-2">Order Summary</h3>
            <div className="space-y-2 mb-4 border-b pb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.title} x{item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity, currency, rate)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal, currency, rate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (5%)</span>
                <span>{formatPrice(tax, currency, rate)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(total, currency, rate)}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t">
                <span>Payment Method</span>
                <span>{paymentMethod || "Not selected"}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {setIsOrderDialogOpen(false); setIsProcessing(false);}}>
              Cancel
            </Button>
            <Button
              onClick={handlePlaceOrder}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Confirm Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </div>
  )
}
