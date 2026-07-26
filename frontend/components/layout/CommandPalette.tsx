'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Hash, Shield, BarChart3, BookOpen, Terminal, Key, Settings, Zap, Scan, ArrowLeftRight, Sliders, Cpu, History, Download, Library } from 'lucide-react'

const pages = [
  { href: '/dashboard', label: 'Dashboard', icon: Zap },
  { href: '/hash-identifier', label: 'Hash Identifier', icon: Hash },
  { href: '/hash-analyzer', label: 'Hash Analyzer', icon: Scan },
  { href: '/password-strength', label: 'Password Strength', icon: Shield },
  { href: '/benchmark', label: 'Benchmark', icon: BarChart3 },
  { href: '/dictionary', label: 'Dictionary Manager', icon: BookOpen },
  { href: '/rule-generator', label: 'Rule Generator', icon: Sliders },
  { href: '/hashcat-builder', label: 'Hashcat Command Builder', icon: Cpu },
  { href: '/john-builder', label: 'John the Ripper Builder', icon: Terminal },
  { href: '/password-generator', label: 'Password Generator', icon: Key },
  { href: '/hash-converter', label: 'Hash Converter', icon: ArrowLeftRight },
  { href: '/learning', label: 'Learning Center', icon: Library },
  { href: '/terminal', label: 'Terminal Simulator', icon: Terminal },
  { href: '/history', label: 'History', icon: History },
  { href: '/export', label: 'Export', icon: Download },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
    setQuery('')
    setSelected(0)
  }, [open])

  const filtered = pages.filter(p => p.label.toLowerCase().includes(query.toLowerCase()))

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    if (e.key === 'Enter' && filtered[selected]) {
      router.push(filtered[selected].href)
      setOpen(false)
    }
  }, [filtered, selected, router])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="glass border border-cyber-edge/60 rounded-xl overflow-hidden shadow-2xl shadow-cyber-cyan/5">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-cyber-edge">
            <Search className="w-4 h-4 text-cyber-muted" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search pages..."
              value={query}
              onChange={e => { setQuery(e.target.value); setSelected(0) }}
              onKeyDown={onKeyDown}
              className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-cyber-text placeholder-cyber-muted"
            />
            <span className="font-mono text-xs text-cyber-muted bg-cyber-panel px-2 py-0.5 rounded">ESC</span>
          </div>
          <div className="max-h-64 overflow-y-auto p-2 space-y-0.5">
            {filtered.map((page, i) => (
              <button
                key={page.href}
                onClick={() => { router.push(page.href); setOpen(false) }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  i === selected ? 'bg-cyber-green/10 text-cyber-green' : 'text-cyber-muted hover:bg-cyber-panel/50'
                }`}
              >
                <page.icon className="w-4 h-4" />
                <span className="font-mono text-sm">{page.label}</span>
              </button>
            ))}
            {filtered.length === 0 && <div className="px-3 py-8 text-center font-mono text-sm text-cyber-muted">No pages found</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
