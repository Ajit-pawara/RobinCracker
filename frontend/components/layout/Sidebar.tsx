'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home, Zap, Hash, Scan, Shield, BarChart3, BookOpen, Terminal, 
  History, Settings, Download, Key, ArrowLeftRight, FileText, 
  Sliders, HelpCircle, Library, ChevronLeft, ChevronRight,
  Cpu, Code2, MessageSquare, X
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSidebar } from './SidebarContext'

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
  const { open, setOpen } = useSidebar()
  const [collapsed, setCollapsed] = useState(true)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setOpen(false)
  }, [pathname, setOpen])

  return (
    <>
      {/* Mobile overlay backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={cn(
        'fixed left-0 top-0 h-screen z-40 transition-all duration-300 border-r border-cyber-edge bg-cyber-bg/95 backdrop-blur-xl flex flex-col',
        // Mobile: slide in/out
        'lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full',
        // Desktop
        collapsed ? 'lg:w-16' : 'lg:w-60',
        'w-60' // Full width on mobile when open
      )}>
        {/* Logo + close */}
        <div className={cn(
          'flex items-center h-16 border-b border-cyber-edge',
          collapsed ? 'lg:justify-center lg:px-0' : 'lg:px-4',
          'px-4 justify-between'
        )}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyber-green/20 border border-cyber-green/40 flex items-center justify-center flex-shrink-0">
              <span className="font-mono text-xs font-bold text-cyber-green">RC</span>
            </div>
            <span className={cn('font-mono font-bold text-sm text-cyber-text', collapsed && 'lg:hidden')}>RobinCracker</span>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-2 rounded-lg text-cyber-muted hover:text-cyber-text hover:bg-cyber-panel/50"
          >
            <X className="w-5 h-5" />
          </button>
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
                  collapsed && 'lg:justify-center lg:px-0',
                  isActive 
                    ? 'bg-cyber-green/10 text-cyber-green border border-cyber-green/20' 
                    : 'text-cyber-muted hover:text-cyber-text hover:bg-cyber-panel/50'
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className={cn(
                  'font-mono text-xs font-medium truncate',
                  collapsed && 'lg:hidden'
                )}>{item.label}</span>
                {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyber-green hidden lg:block" />}
              </Link>
            )
          })}
        </nav>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center h-12 border-t border-cyber-edge text-cyber-muted hover:text-cyber-text transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>
    </>
  )
}
