import { Menu, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SidebarNavProps {
  activePage: string
}

export function SidebarNav({ activePage }: SidebarNavProps) {
  const navItems = [
    { icon: Menu, label: "POS", href: "/", id: "pos" },
    { icon: Settings, label: "Settings", href: "/settings", id: "settings" },
  ]

  return (
    <div className="w-64 p-4 border-r h-screen bg-white">
      <div className="flex items-center gap-2 mb-8">
        <img src="/placeholder.svg?height=32&width=32" alt="Chili POS Logo" className="w-8 h-8" />
        <span className="font-semibold">CHILI POS</span>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link href={item.href} key={item.id} className="block">
            <Button
              variant={activePage === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start ${activePage === item.id ? "text-green-600 bg-green-50" : "text-gray-600"}`}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  )
}
