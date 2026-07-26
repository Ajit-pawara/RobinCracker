'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { Copy, CheckCircle, Terminal } from 'lucide-react'

const hashTypes = ['MD5', 'SHA1', 'SHA256', 'SHA512', 'bcrypt', 'sha512crypt', 'NTLM']

export default function JohnBuilder() {
  const [hashType, setHashType] = useState('sha512crypt')
  const [wordlist, setWordlist] = useState('/usr/share/wordlists/rockyou.txt')
  const [rules, setRules] = useState('')
  const [format, setFormat] = useState('')
  const [session, setSession] = useState('')
  const [command, setCommand] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    setLoading(true)
    try {
      const data = await api.johnCommand({ hash_type: hashType, wordlist, rules, format_type: format, session })
      setCommand(data.command)
    } catch {}
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono font-bold text-2xl">John the Ripper Command Builder</h1>
        <p className="text-cyber-muted text-sm mt-1">Generate equivalent john commands for hash cracking</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-cyber-muted mb-1.5">Hash Type</label>
              <select value={hashType} onChange={e => setHashType(e.target.value)} className="cyber-input">
                {hashTypes.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-mono text-xs text-cyber-muted mb-1.5">Wordlist Path</label>
              <input type="text" value={wordlist} onChange={e => setWordlist(e.target.value)} className="cyber-input" />
            </div>
            <div>
              <label className="block font-mono text-xs text-cyber-muted mb-1.5">Rules</label>
              <input type="text" value={rules} onChange={e => setRules(e.target.value)} className="cyber-input" placeholder="Single, Wordlist, etc." />
            </div>
            <div>
              <label className="block font-mono text-xs text-cyber-muted mb-1.5">Session Name</label>
              <input type="text" value={session} onChange={e => setSession(e.target.value)} className="cyber-input" placeholder="john_session" />
            </div>
          </div>

          <Button variant="primary" onClick={generate} className="w-full" disabled={loading}>
            <Terminal className="w-4 h-4" /> Generate John Command
          </Button>
        </CardContent>
      </Card>

      {command && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Generated Command</CardTitle>
                <button onClick={() => { navigator.clipboard.writeText(command); setCopied(true); setTimeout(() => setCopied(false), 2000) }} className="p-1.5 rounded-md hover:bg-cyber-panel">
                  {copied ? <CheckCircle className="w-4 h-4 text-cyber-green" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="terminal-dot bg-red-500" />
                  <div className="terminal-dot bg-yellow-500" />
                  <div className="terminal-dot bg-green-500" />
                  <span className="font-mono text-xs text-cyber-muted ml-2">john</span>
                </div>
                <div className="terminal-body">
                  <span className="text-cyber-muted">$ </span>
                  <span className="text-cyber-green">{command}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
