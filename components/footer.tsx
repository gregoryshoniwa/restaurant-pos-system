"use client"

import { useState } from "react"
import { Check, Clock } from "lucide-react"

export function Footer() {
  const [orders, setOrders] = useState([
    { id: "T1", table: "T1", items: 6, kitchen: "Kitchen", status: "Process" },
    { id: "T2", table: "T2", items: 4, kitchen: "Kitchen", status: "Pending" },
    { id: "T3", table: "T3", items: 3, kitchen: "Kitchen", status: "Pending" },
  ])

  const handleOrderClick = (id: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id
          ? {
              ...order,
              status: order.status === "Process" ? "Completed" : order.status === "Pending" ? "Process" : "Pending",
            }
          : order,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Process":
        return "text-orange-600 bg-orange-50"
      case "Completed":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Process":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "Completed":
        return <Check className="h-4 w-4 text-green-600" />
      default:
        return null
    }
  }

  return (
    <div className="bg-white border-t p-4 flex gap-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className={`flex items-center gap-3 rounded-lg p-3 flex-1 cursor-pointer transition-colors ${getStatusColor(order.status)}`}
          onClick={() => handleOrderClick(order.id)}
        >
          <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-white font-medium">
            {order.table}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium flex items-center justify-between">
              <span>
                {order.items} Items → {order.kitchen}
              </span>
              {getStatusIcon(order.status)}
            </div>
            <div className="text-xs">{order.status}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
