'use client'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import CommandPalette from '@/components/layout/CommandPalette'
import AnimatedBackground from '@/components/layout/AnimatedBackground'

const landingPaths = ['/']

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isLanding = landingPaths.includes(pathname)

  if (isLanding) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
      <AnimatedBackground />
      <Sidebar />
      <div className="flex-1 ml-16 lg:ml-60">
        <TopBar />
        <main className="p-6 relative z-10">
          {children}
        </main>
      </div>
      <CommandPalette />
    </div>
  )
}
