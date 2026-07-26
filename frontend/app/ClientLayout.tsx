'use client'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { SidebarProvider } from '@/components/layout/SidebarContext'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import CommandPalette from '@/components/layout/CommandPalette'
import AnimatedBackground from '@/components/layout/AnimatedBackground'
import HowToUse from '@/components/layout/HowToUse'

const landingPaths = ['/']

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isLanding = landingPaths.includes(pathname)

  if (isLanding) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AnimatedBackground />
        <Sidebar />
        {/* Mobile: no margin (sidebar overlays), Desktop: ml matching sidebar */}
        <div className="flex-1 lg:ml-60 min-w-0">
          <TopBar />
          <main className="p-3 md:p-6 relative z-10 max-w-full overflow-x-hidden">
            {children}
          </main>
        </div>
        <CommandPalette />
        <HowToUse />
      </div>
    </SidebarProvider>
  )
}
