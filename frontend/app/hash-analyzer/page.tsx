'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { api } from '@/lib/api'
import { Scan, Shield, AlertTriangle, Info } from 'lucide-react'

export default function HashAnalyzer() {
  const [hash, setHash] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const analyze = async () => {
    if (!hash.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await api.analyze(hash.trim())
      setResult(data)
    } catch (e: any) {
      setError(e.message || 'Analysis failed')
    }
    setLoading(false)
  }

  const riskColor = (level: string) => {
    if (level === 'Critical') return 'danger'
    if (level === 'High') return 'warning'
    if (level === 'Medium') return 'default'
    return 'success'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono font-bold text-2xl">Hash Analyzer</h1>
        <p className="text-cyber-muted text-sm mt-1">Deep analysis of hash strings — entropy, encoding, character set</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={hash}
              onChange={e => setHash(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && analyze()}
              placeholder="Enter a hash for deep analysis..."
              className="cyber-input flex-1"
            />
            <Button variant="primary" onClick={analyze} disabled={loading || !hash.trim()}>
              <Scan className="w-4 h-4" /> Analyze
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-lg bg-cyber-red/10 border border-cyber-red/30 text-cyber-red text-sm font-mono">
          {error}
        </motion.div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-xs text-cyber-muted mb-1">Length</div>
                <div className="font-mono text-2xl font-bold">{result.length}</div>
                <div className="text-xs text-cyber-muted">characters</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-xs text-cyber-muted mb-1">Entropy</div>
                <div className="font-mono text-2xl font-bold text-cyber-cyan">{result.entropy}</div>
                <div className="text-xs text-cyber-muted">bits</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-xs text-cyber-muted mb-1">Risk Level</div>
                <div className="mt-1">
                  <Badge variant={riskColor(result.risk_level) as any}>{result.risk_level}</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-xs text-cyber-muted mb-1">Complexity</div>
                <div className="font-mono text-lg font-bold text-cyber-amber">{result.complexity}</div>
              </CardContent>
            </Card>
          </div>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Character Set Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-panel/50">
                  <span className="text-sm text-cyber-muted">Has lowercase</span>
                  <Badge variant={result.character_set?.has_lowercase ? 'success' : 'default'}>
                    {result.character_set?.has_lowercase ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-panel/50">
                  <span className="text-sm text-cyber-muted">Has uppercase</span>
                  <Badge variant={result.character_set?.has_uppercase ? 'success' : 'default'}>
                    {result.character_set?.has_uppercase ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-panel/50">
                  <span className="text-sm text-cyber-muted">Has digits</span>
                  <Badge variant={result.character_set?.has_digits ? 'success' : 'default'}>
                    {result.character_set?.has_digits ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-panel/50">
                  <span className="text-sm text-cyber-muted">Has special chars</span>
                  <Badge variant={result.character_set?.has_special ? 'success' : 'default'}>
                    {result.character_set?.has_special ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-panel/50">
                  <span className="text-sm text-cyber-muted">Unique characters</span>
                  <span className="font-mono text-sm">{result.character_set?.unique_chars}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-cyber-panel/50">
                  <span className="text-sm text-cyber-muted">Character set size</span>
                  <span className="font-mono text-sm">{result.character_set?.size}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Encoding */}
          <Card>
            <CardHeader>
              <CardTitle>Encoding Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-cyber-panel/50">
                  <div className={`w-3 h-3 rounded-full ${result.hex_encoded ? 'bg-cyber-green' : 'bg-cyber-muted/30'}`} />
                  <div>
                    <div className="text-sm font-medium">HEX</div>
                    <div className="text-xs text-cyber-muted">{result.hex_encoded ? 'Detected' : 'Not detected'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-cyber-panel/50">
                  <div className={`w-3 h-3 rounded-full ${result.base64_encoded ? 'bg-cyber-green' : 'bg-cyber-muted/30'}`} />
                  <div>
                    <div className="text-sm font-medium">Base64</div>
                    <div className="text-xs text-cyber-muted">{result.base64_encoded ? 'Detected' : 'Not detected'}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Meter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-cyber-amber" /> Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Entropy Score</span>
                  <span className="font-mono">{result.entropy} / 100</span>
                </div>
                <Progress value={Math.min(100, result.entropy)} variant={riskColor(result.risk_level) as any} />
                <div className="flex justify-between text-xs text-cyber-muted mt-1">
                  <span>Low entropy → easier to crack</span>
                  <span>High entropy → harder to crack</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
