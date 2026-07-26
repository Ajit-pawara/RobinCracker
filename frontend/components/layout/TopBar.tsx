'use client'
import { useState, useEffect } from 'react'
import { Search, Menu } from 'lucide-react'
import { useSidebar } from './SidebarContext'

export default function TopBar() {
  const [time, setTime] = useState('')
  const { toggle } = useSidebar()

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="h-12 border-b border-cyber-edge bg-cyber-bg/80 backdrop-blur-xl flex items-center justify-between px-3 md:px-6">
      <div className="flex items-center gap-2 md:gap-4">
        {/* Hamburger — mobile only */}
        <button
          onClick={toggle}
          className="lg:hidden p-2 rounded-lg text-cyber-muted hover:text-cyber-text hover:bg-cyber-panel/50"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-cyber-muted">
          <span className="font-mono text-xs">robin@cracker:~$</span>
          <span className="font-mono text-xs text-cyber-green">_</span>
        </div>
      </div>
      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyber-panel/50 border border-cyber-edge">
          <Search className="w-3.5 h-3.5 text-cyber-muted" />
          <span className="font-mono text-xs text-cyber-muted">Ctrl+K</span>
        </div>
        <div className="font-mono text-xs text-cyber-cyan">{time}</div>
        <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse-glow" />
      </div>
    </header>
  )
}
