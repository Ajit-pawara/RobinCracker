'use client'
import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Settings as SettingsIcon, Monitor, Type, Palette, Zap, Globe, Trash2, RefreshCw, Code2, GitBranch, ExternalLink, User, Sparkles, ChevronRight } from 'lucide-react'

export default function Settings() {
  const [theme, setTheme] = useState('dark')
  const [animations, setAnimations] = useState(true)
  const [fontSize, setFontSize] = useState('medium')
  const [terminalFont, setTerminalFont] = useState('JetBrains Mono')
  const [accent, setAccent] = useState('green')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('robin-settings')
    if (saved) {
      try {
        const s = JSON.parse(saved)
        setAnimations(s.animations ?? true)
        setFontSize(s.fontSize || 'medium')
        setTerminalFont(s.terminalFont || 'JetBrains Mono')
        setAccent(s.accent || 'green')
      } catch {}
    }
  }, [])

  const save = () => {
    localStorage.setItem('robin-settings', JSON.stringify({ animations, fontSize, terminalFont, accent }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const clearHistory = () => {
    if (confirm('Clear all local data and history?')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono font-bold text-2xl">Settings</h1>
        <p className="text-cyber-muted text-sm mt-1">Customize your RobinCracker experience</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Palette className="w-4 h-4" /> Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm">Theme</p>
              <p className="text-xs text-cyber-muted">Dark mode only (for now)</p>
            </div>
            <Badge variant="info">Dark</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm">Animations</p>
              <p className="text-xs text-cyber-muted">Enable motion effects and transitions</p>
            </div>
            <button
              onClick={() => setAnimations(!animations)}
              className={`relative w-12 h-6 rounded-full transition-colors ${animations ? 'bg-cyber-green' : 'bg-cyber-edge'}`}
            >
              <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-transform ${animations ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm">Accent Color</p>
              <p className="text-xs text-cyber-muted">Primary accent for highlights</p>
            </div>
            <div className="flex gap-2">
              {['green', 'cyan', 'purple', 'amber'].map(c => (
                <button
                  key={c}
                  onClick={() => setAccent(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    accent === c ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c === 'green' ? '#39ff88' : c === 'cyan' ? '#4fd1ff' : c === 'purple' ? '#b389ff' : '#ffb454' }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Type className="w-4 h-4" /> Font</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm">UI Font Size</p>
              <p className="text-xs text-cyber-muted">Controls the base font size</p>
            </div>
            <select value={fontSize} onChange={e => setFontSize(e.target.value)} className="cyber-input w-32">
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm">Terminal Font</p>
              <p className="text-xs text-cyber-muted">Monospace font for code/terminal</p>
            </div>
            <select value={terminalFont} onChange={e => setTerminalFont(e.target.value)} className="cyber-input w-40">
              <option value="JetBrains Mono">JetBrains Mono</option>
              <option value="IBM Plex Mono">IBM Plex Mono</option>
              <option value="Fira Code">Fira Code</option>
              <option value="Source Code Pro">Source Code Pro</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Zap className="w-4 h-4" /> Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="danger" onClick={clearHistory} className="w-full">
            <Trash2 className="w-4 h-4" /> Clear All Local Data
          </Button>
          <p className="text-xs text-cyber-muted">This clears all locally stored settings and cached data. Refresh required.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Code2 className="w-4 h-4" /> Developer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-mono font-bold text-lg text-cyber-text">Ajit Pawara</p>
                <p className="text-xs text-cyber-muted">Full Stack Developer · Cybersecurity Enthusiast</p>
                <div className="flex items-center gap-3 mt-2">
                  <a href="https://github.com/Ajit-pawara" target="_blank" rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 text-xs text-cyber-cyan hover:text-cyber-green transition-colors">
                    <GitBranch className="w-3.5 h-3.5" /> @Ajit-pawara
                  </a>
                  <span className="text-cyber-muted text-xs">·</span>
                  <a href="https://github.com/Ajit-pawara/Portfolio" target="_blank" rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 text-xs text-cyber-cyan hover:text-cyber-green transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" /> Portfolio
                  </a>
                </div>
              </div>
            </div>

            <details className="group">
              <summary className="cursor-pointer font-mono text-sm text-cyber-text hover:text-cyber-cyan transition-colors flex items-center gap-2 list-none [&::-webkit-details-marker]:hidden">
                <Sparkles className="w-4 h-4 text-cyber-cyan" />
                How RobinCracker was built
                <ChevronRight className="w-4 h-4 ml-auto transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-3 p-4 rounded-xl bg-cyber-bg/50 border border-cyber-edge space-y-3 text-sm text-cyber-muted leading-relaxed">
<p><strong className="text-cyber-text">RobinCracker</strong> was built as part of my <strong className="text-cyber-text">90-Day Cybersecurity Portfolio</strong> — Day 20: Password Security &amp; Hashing Attacks.</p>

                <p>The idea was simple: instead of just learning hash cracking, build a tool that makes the entire workflow visual and accessible. What started as a command-line lesson turned into a full-stack web app.</p>

                <ul className="space-y-1.5 list-disc list-inside text-cyber-muted">
                  <li><strong className="text-cyber-text">Frontend:</strong> Next.js 14 + TypeScript + TailwindCSS + Framer Motion</li>
                  <li><strong className="text-cyber-text">Backend:</strong> FastAPI (Python) + SQLite + bcrypt</li>
                  <li><strong className="text-cyber-text">Deployment:</strong> Vercel (frontend) + Render (backend)</li>
                  <li><strong className="text-cyber-text">Time:</strong> Built over several sessions, iterating feature by feature</li>
                  <li><strong className="text-cyber-text">Features:</strong> 16 modules — hash ID, analysis, password strength, cracking commands, benchmark, dictionary manager, and more</li>
                </ul>

                <p className="text-cyber-green/80">🎯 Goal: Make password security auditing accessible to everyone — from CTF players to professional pentesters.</p>
              </div>
            </details>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-xs text-cyber-muted">
                Built with Next.js 14 + FastAPI · Deployed on Vercel + Render · 
                <a href="https://github.com/Ajit-pawara/RobinCracker" target="_blank" rel="noopener noreferrer" 
                  className="text-cyber-cyan hover:underline ml-1">
                  Source Code <ExternalLink className="w-3 h-3 inline" />
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button variant="primary" onClick={save} className="w-full">
        <RefreshCw className="w-4 h-4" /> {saved ? 'Settings Saved ✓' : 'Save Settings'}
      </Button>
    </div>
  )
}
