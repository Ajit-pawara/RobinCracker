'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { api } from '@/lib/api'
import { Shield, Eye, EyeOff, Lightbulb, BarChart3 } from 'lucide-react'

export default function PasswordStrength() {
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const check = async () => {
    if (!password) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await api.passwordStrength(password)
      setResult(data)
    } catch (e: any) {
      setError(e.message || 'Check failed')
    }
    setLoading(false)
  }

  const strengthColor = (s: string) => {
    if (s === 'Very Strong') return 'success'
    if (s === 'Strong') return 'info'
    if (s === 'Moderate') return 'warning'
    return 'danger'
  }

  const strengthVal = (s: string) => {
    if (s === 'Very Strong') return 95
    if (s === 'Strong') return 75
    if (s === 'Moderate') return 50
    if (s === 'Weak') return 25
    return 10
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono font-bold text-2xl">Password Strength Estimator</h1>
        <p className="text-cyber-muted text-sm mt-1">Measure entropy and estimate crack time across GPU speeds</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && check()}
                placeholder="Type a password to test..."
                className="cyber-input pr-10"
              />
              <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-muted hover:text-cyber-text">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button variant="primary" onClick={check} disabled={loading || !password}>
              <Shield className="w-4 h-4" /> Check
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 rounded-lg bg-cyber-red/10 border border-cyber-red/30 text-cyber-red text-sm font-mono">{error}</div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Strength Meter */}
          <Card>
            <CardContent className="p-3 md:p-6">
              <div className="text-center mb-6">
                <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono text-lg font-bold ${
                  result.strength === 'Very Strong' ? 'bg-cyber-green/10 text-cyber-green border border-cyber-green/30' :
                  result.strength === 'Strong' ? 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30' :
                  result.strength === 'Moderate' ? 'bg-cyber-amber/10 text-cyber-amber border border-cyber-amber/30' :
                  'bg-cyber-red/10 text-cyber-red border border-cyber-red/30'
                }`}>
                  <Shield className="w-5 h-5" /> {result.strength}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Strength Score</span>
                  <span className="font-mono">{strengthVal(result.strength)}%</span>
                </div>
                <Progress value={strengthVal(result.strength)} variant={strengthColor(result.strength) as any} />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 rounded-lg bg-cyber-panel/50">
                  <div className="text-xs text-cyber-muted">Entropy</div>
                  <div className="font-mono text-xl font-bold text-cyber-cyan">{result.entropy}</div>
                  <div className="text-xs text-cyber-muted">bits</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-cyber-panel/50">
                  <div className="text-xs text-cyber-muted">Length</div>
                  <div className="font-mono text-xl font-bold">{result.length}</div>
                  <div className="text-xs text-cyber-muted">chars</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-cyber-panel/50">
                  <div className="text-xs text-cyber-muted">Charset</div>
                  <div className="font-mono text-xl font-bold text-cyber-amber">{result.charset_size}</div>
                  <div className="text-xs text-cyber-muted">unique</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crack Time Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Estimated Crack Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {result.crack_times && Object.entries(result.crack_times).map(([speed, time]: [string, any]) => (
                  <div key={speed} className="flex items-center justify-between p-3 rounded-lg bg-cyber-panel/50 border border-cyber-edge">
                    <span className="font-mono text-sm">{speed}</span>
                    <span className={`font-mono text-sm font-bold ${
                      time === 'Instant' ? 'text-cyber-red' :
                      time.includes('years') ? 'text-cyber-green' :
                      time.includes('days') ? 'text-cyber-cyan' :
                      time.includes('hours') ? 'text-cyber-amber' : 'text-cyber-text'
                    }`}>{time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Suggestions */}
          {result.suggestions && result.suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lightbulb className="w-4 h-4 text-cyber-amber" /> Improvement Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.suggestions.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-cyber-muted">
                      <span className="text-cyber-amber mt-0.5">→</span> {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  )
}
