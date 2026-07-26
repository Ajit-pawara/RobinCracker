'use client'
import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Settings as SettingsIcon, Type, Palette, Zap, Globe, Trash2, RefreshCw } from 'lucide-react'

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

      <Button variant="primary" onClick={save} className="w-full">
        <RefreshCw className="w-4 h-4" /> {saved ? 'Settings Saved ✓' : 'Save Settings'}
      </Button>
    </div>
  )
}
