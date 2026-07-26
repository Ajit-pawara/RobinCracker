'use client'
import { cn } from '@/lib/utils'
import { useState, createContext, useContext, ReactNode } from 'react'

interface TabsContextType {
  active: string
  setActive: (v: string) => void
}
const TabsCtx = createContext<TabsContextType>({ active: '', setActive: () => {} })

export function Tabs({ children, defaultTab, className }: { children: ReactNode; defaultTab: string; className?: string }) {
  const [active, setActive] = useState(defaultTab)
  return (
    <TabsCtx.Provider value={{ active, setActive }}>
      <div className={cn('', className)}>{children}</div>
    </TabsCtx.Provider>
  )
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex gap-1 p-1 bg-cyber-bg border border-cyber-edge rounded-lg mb-4 overflow-x-auto', className)}>{children}</div>
}

export function TabsTrigger({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const { active, setActive } = useContext(TabsCtx)
  return (
    <button
      onClick={() => setActive(value)}
      className={cn(
        'px-4 py-2 rounded-md font-mono text-xs font-semibold transition-all duration-200 whitespace-nowrap',
        active === value ? 'bg-cyber-panel text-cyber-cyan border border-cyber-cyan/30 shadow-sm' : 'text-cyber-muted hover:text-cyber-text',
        className
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const { active } = useContext(TabsCtx)
  if (active !== value) return null
  return <div className={cn('animate-fade-in', className)}>{children}</div>
}
