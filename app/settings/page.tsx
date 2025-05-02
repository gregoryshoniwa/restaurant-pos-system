"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { SettingsContent } from "@/components/settings-content"
import { Toaster } from "@/components/ui/toaster"

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarNav activePage="settings" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Settings" />
        <div className="flex-1 overflow-auto p-6">
          <SettingsContent />
        </div>
      </div>
      <Toaster />
    </div>
  )
}
