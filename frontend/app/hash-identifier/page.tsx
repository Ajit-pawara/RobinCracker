'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { api } from '@/lib/api'
import { Hash, Copy, CheckCircle, AlertCircle, Info, FileText, Code } from 'lucide-react'

const exampleHashes = {
  'MD5': '5f4dcc3b5aa765d61d8327deb882cf99',
  'SHA-1': '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8',
  'SHA-256': '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
  'SHA-512': 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
  'bcrypt': '$2y$12$Dwt1BZj6pcyc3Dy1FWZ5ieeUznr71EeNkJkUlypTsgbX1H68wsRom',
}

export default function HashIdentifier() {
  const [hash, setHash] = useState('')
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const identify = async () => {
    if (!hash.trim()) return
    setLoading(true)
    setError('')
    setResults(null)
    try {
      const data = await api.identify(hash.trim())
      setResults(data)
    } catch (e: any) {
      setError(e.message || 'Failed to identify hash. Is the backend running?')
    }
    setLoading(false)
  }

  const copyResult = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono font-bold text-2xl">Hash Identifier</h1>
        <p className="text-cyber-muted text-sm mt-1">Paste a hash to automatically identify its algorithm</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={hash}
              onChange={e => setHash(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && identify()}
              placeholder="Paste a hash here... e.g., 5f4dcc3b5aa765d61d8327deb882cf99"
              className="cyber-input flex-1"
            />
            <Button variant="primary" onClick={identify} disabled={loading || !hash.trim()}>
              {loading ? 'Analyzing...' : 'Identify'}
              <Hash className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick examples */}
          <div>
            <p className="font-mono text-xs text-cyber-muted mb-2">Quick try:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(exampleHashes).map(([name, h]) => (
                <button
                  key={name}
                  onClick={() => setHash(h)}
                  className="px-3 py-1.5 rounded-md bg-cyber-panel/50 border border-cyber-edge font-mono text-xs text-cyber-muted hover:text-cyber-cyan hover:border-cyber-cyan/30 transition-all"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-lg bg-cyber-red/10 border border-cyber-red/30 text-cyber-red text-sm font-mono">
          {error}
        </motion.div>
      )}

      {results && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Results */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Identification Results</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="success">
                    <CheckCircle className="w-3 h-3" /> {results.results?.length || 0} match{results.results?.length !== 1 ? 'es' : ''}
                  </Badge>
                  <button onClick={() => copyResult(JSON.stringify(results, null, 2))} className="p-1.5 rounded-md hover:bg-cyber-panel text-cyber-muted hover:text-cyber-text transition-colors">
                    {copied ? <CheckCircle className="w-4 h-4 text-cyber-green" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Top match */}
              {results.results?.[0] && (
                <div className="p-4 rounded-lg bg-cyber-green/5 border border-cyber-green/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-lg text-cyber-green">{results.results[0].algorithm}</span>
                      <Badge variant="success">{results.results[0].confidence}% confidence</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    <div className="p-2 rounded bg-cyber-bg/50">
                      <div className="text-xs text-cyber-muted">Length</div>
                      <div className="font-mono text-sm">{results.results[0].length} bits</div>
                    </div>
                    <div className="p-2 rounded bg-cyber-bg/50">
                      <div className="text-xs text-cyber-muted">Hashcat Mode</div>
                      <div className="font-mono text-sm">{results.results[0].example_cmd || 'N/A'}</div>
                    </div>
                    <div className="p-2 rounded bg-cyber-bg/50 col-span-2">
                      <div className="text-xs text-cyber-muted">Note</div>
                      <div className="font-mono text-sm">{results.results[0].note || '—'}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* All matches */}
              <div>
                <h4 className="font-mono text-sm font-semibold mb-3">All Possible Matches</h4>
                <div className="space-y-2">
                  {results.results?.map((r: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-cyber-panel/50 border border-cyber-edge">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm">{r.algorithm}</span>
                        <span className="text-xs text-cyber-muted">{r.length} bits</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-cyber-muted">{r.note}</span>
                        <Badge variant={r.confidence > 80 ? 'success' : r.confidence > 50 ? 'warning' : 'default'}>
                          {r.confidence}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analysis */}
              {results.analysis && (
                <div className="p-4 rounded-lg bg-cyber-cyan/5 border border-cyber-cyan/20">
                  <h4 className="font-mono text-sm font-semibold mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4 text-cyber-cyan" /> Format Analysis
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <div className="text-xs text-cyber-muted">String Length</div>
                      <div className="font-mono text-sm">{results.analysis.length} chars</div>
                    </div>
                    <div>
                      <div className="text-xs text-cyber-muted">Entropy</div>
                      <div className="font-mono text-sm">{results.analysis.entropy || '—'} bits</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-cyber-muted">Character Set</div>
                      <div className="font-mono text-sm truncate">{results.analysis.char_set}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hashcat command hint */}
          {results.results?.[0]?.example_cmd && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Code className="w-4 h-4" /> Quick Command</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="terminal-window">
                  <div className="terminal-body text-sm">
                    <span className="text-cyber-muted">$ </span>
                    <span>{results.results[0].example_cmd} -a 0 hash.txt /path/to/wordlist.txt</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  )
}
