'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home, Zap, Hash, Scan, Shield, BarChart3, BookOpen, Terminal, 
  History, Settings, Download, Key, ArrowLeftRight, FileText, 
  Sliders, HelpCircle, Library, ChevronLeft, ChevronRight,
  Cpu, Code2, MessageSquare
} from 'lucide-react'
import { useState, useEffect } from 'react'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: Zap },
  { href: '/hash-identifier', label: 'Hash Identifier', icon: Hash },
  { href: '/hash-analyzer', label: 'Hash Analyzer', icon: Scan },
  { href: '/password-strength', label: 'Password Strength', icon: Shield },
  { href: '/benchmark', label: 'Benchmark', icon: BarChart3 },
  { href: '/dictionary', label: 'Dictionary', icon: BookOpen },
  { href: '/rule-generator', label: 'Rule Generator', icon: Sliders },
  { href: '/hashcat-builder', label: 'Hashcat Builder', icon: Cpu },
  { href: '/john-builder', label: 'John Builder', icon: Terminal },
  { href: '/password-generator', label: 'Password Gen', icon: Key },
  { href: '/hash-converter', label: 'Hash Converter', icon: ArrowLeftRight },
  { href: '/learning', label: 'Learning Center', icon: Library },
  { href: '/terminal', label: 'Terminal Sim', icon: Terminal },
  { href: '/history', label: 'History', icon: History },
  { href: '/export', label: 'Export', icon: Download },
  { href: '/developer', label: 'Developer', icon: Code2 },
  { href: '/feedback', label: 'Feedback', icon: MessageSquare },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-screen z-40 transition-all duration-300 border-r border-cyber-edge bg-cyber-bg/95 backdrop-blur-xl flex flex-col',
      collapsed ? 'w-16' : 'w-60'
    )}>
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-4 h-16 border-b border-cyber-edge', collapsed && 'justify-center px-0')}>
        <div className="w-8 h-8 rounded-lg bg-cyber-green/20 border border-cyber-green/40 flex items-center justify-center flex-shrink-0">
          <span className="font-mono text-xs font-bold text-cyber-green">RC</span>
        </div>
        {!collapsed && <span className="font-mono font-bold text-sm text-cyber-text">RobinCracker</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5 scrollbar-thin">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/dashboard')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                collapsed && 'justify-center px-0',
                isActive 
                  ? 'bg-cyber-green/10 text-cyber-green border border-cyber-green/20' 
                  : 'text-cyber-muted hover:text-cyber-text hover:bg-cyber-panel/50'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="font-mono text-xs font-medium truncate">{item.label}</span>}
              {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyber-green" />}
            </Link>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-cyber-edge text-cyber-muted hover:text-cyber-text transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  )
}
