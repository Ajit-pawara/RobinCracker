'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { Key, Copy, CheckCircle, RefreshCw } from 'lucide-react'

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [charsetType, setCharsetType] = useState('all')
  const [count, setCount] = useState(5)
  const [passwords, setPasswords] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState(-1)

  const generate = async () => {
    setLoading(true)
    try {
      const data = await api.generatePassword(length, charsetType, count)
      setPasswords(data.passwords || [])
    } catch {}
    setLoading(false)
  }

  const copyPwd = (pwd: string, idx: number) => {
    navigator.clipboard.writeText(pwd)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(-1), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono font-bold text-2xl">Password Generator</h1>
        <p className="text-cyber-muted text-sm mt-1">Generate secure passwords with configurable entropy</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-5">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs text-cyber-muted mb-1.5">Length</label>
              <input type="number" value={length} onChange={e => setLength(Number(e.target.value))} min={4} max={128} className="cyber-input" />
            </div>
            <div>
              <label className="block font-mono text-xs text-cyber-muted mb-1.5">Character Set</label>
              <select value={charsetType} onChange={e => setCharsetType(e.target.value)} className="cyber-input">
                <option value="all">All (letters + digits + symbols)</option>
                <option value="alphanumeric">Alphanumeric</option>
                <option value="lower">Lowercase only</option>
                <option value="upper">Uppercase only</option>
                <option value="digits">Digits only</option>
                <option value="hex">Hexadecimal</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-xs text-cyber-muted mb-1.5">Count</label>
              <input type="number" value={count} onChange={e => setCount(Number(e.target.value))} min={1} max={50} className="cyber-input" />
            </div>
          </div>

          <Button variant="primary" onClick={generate} className="w-full" disabled={loading}>
            <Key className="w-4 h-4" /> {loading ? 'Generating...' : 'Generate Passwords'}
          </Button>
        </CardContent>
      </Card>

      {passwords.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Generated Passwords</CardTitle>
                <Badge variant="info">{length} chars · {charsetType}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {passwords.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-cyber-panel/50 border border-cyber-edge group">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-cyber-muted w-6">#{i + 1}</span>
                      <code className="font-mono text-sm">{p.password}</code>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="info">{p.entropy} bits</Badge>
                      <button onClick={() => copyPwd(p.password, i)} className="p-1.5 rounded-md hover:bg-cyber-bg text-cyber-muted hover:text-cyber-text opacity-0 group-hover:opacity-100 transition-all">
                        {copiedIdx === i ? <CheckCircle className="w-4 h-4 text-cyber-green" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
