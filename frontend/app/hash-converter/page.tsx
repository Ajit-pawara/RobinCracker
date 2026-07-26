'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { api } from '@/lib/api'
import { ArrowLeftRight, Copy, CheckCircle, Repeat } from 'lucide-react'

export default function HashConverter() {
  const [input, setInput] = useState('')
  const [fromFormat, setFromFormat] = useState('hex')
  const [toFormat, setToFormat] = useState('base64')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  const convert = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await api.convertHash(input.trim(), fromFormat, toFormat)
      setResult(data)
    } catch (e: any) {
      setError(e.message || 'Conversion failed')
    }
    setLoading(false)
  }

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  const swapFormats = () => {
    const temp = fromFormat
    setFromFormat(toFormat)
    setToFormat(temp)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono font-bold text-2xl">Hash Converter</h1>
        <p className="text-cyber-muted text-sm mt-1">Convert between HEX, Base64, Binary, ASCII, and UTF-8</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && convert()}
            placeholder="Enter a hash string to convert..."
            className="cyber-input"
          />

          <div className="flex items-center gap-3">
            <select value={fromFormat} onChange={e => setFromFormat(e.target.value)} className="cyber-input flex-1">
              <option value="hex">HEX</option>
              <option value="base64">Base64</option>
              <option value="binary">Binary</option>
              <option value="ascii">ASCII</option>
            </select>
            <button onClick={swapFormats} className="p-2 rounded-lg bg-cyber-panel border border-cyber-edge hover:border-cyber-cyan/50 transition-colors">
              <Repeat className="w-4 h-4 text-cyber-cyan" />
            </button>
            <select value={toFormat} onChange={e => setToFormat(e.target.value)} className="cyber-input flex-1">
              <option value="hex">HEX</option>
              <option value="base64">Base64</option>
              <option value="binary">Binary</option>
              <option value="ascii">ASCII</option>
              <option value="utf8">UTF-8</option>
            </select>
          </div>

          <Button variant="primary" onClick={convert} className="w-full" disabled={loading || !input.trim()}>
            <ArrowLeftRight className="w-4 h-4" /> Convert
          </Button>
        </CardContent>
      </Card>

      {error && <div className="p-4 rounded-lg bg-cyber-red/10 border border-cyber-red/30 text-cyber-red text-sm font-mono">{error}</div>}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle>Conversion Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.all_formats && Object.entries(result.all_formats).filter(([k]) => k !== 'length' && k !== 'bits').map(([format, value]: [string, any]) => (
                <div key={format} className="flex items-center gap-3 p-3 rounded-lg bg-cyber-panel/50 border border-cyber-edge">
                  <Badge variant="info" className="uppercase w-16 justify-center">{format}</Badge>
                  <code className="flex-1 font-mono text-sm truncate">{String(value).substring(0, 80)}{String(value).length > 80 ? '...' : ''}</code>
                  <button onClick={() => copy(String(value), format)} className="p-1.5 rounded-md hover:bg-cyber-bg text-cyber-muted hover:text-cyber-text transition-colors flex-shrink-0">
                    {copied === format ? <CheckCircle className="w-4 h-4 text-cyber-green" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-lg bg-cyber-bg/50 text-center">
                  <div className="text-xs text-cyber-muted">Length</div>
                  <div className="font-mono text-lg">{result.all_formats?.length || 0} bytes</div>
                </div>
                <div className="p-3 rounded-lg bg-cyber-bg/50 text-center">
                  <div className="text-xs text-cyber-muted">Bits</div>
                  <div className="font-mono text-lg">{result.all_formats?.bits || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
