'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { Copy, CheckCircle, Cpu, Terminal, Info } from 'lucide-react'

const hashTypes = ['MD5', 'SHA1', 'SHA256', 'SHA512', 'bcrypt', 'NTLM', 'sha512crypt', 'Argon2']
const attackModes = ['Dictionary', 'Combination', 'Mask', 'Hybrid dict+mask', 'Hybrid mask+dict']

export default function HashcatBuilder() {
  const [hashType, setHashType] = useState('MD5')
  const [attackMode, setAttackMode] = useState('Dictionary')
  const [wordlist, setWordlist] = useState('/usr/share/wordlists/rockyou.txt')
  const [mask, setMask] = useState('')
  const [rules, setRules] = useState('')
  const [session, setSession] = useState('')
  const [gpu, setGpu] = useState('')
  const [output, setOutput] = useState('')
  const [command, setCommand] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const generate = async () => {
    setLoading(true)
    try {
      const data = await api.hashcatCommand({
        hash_type: hashType,
        attack_mode: attackMode,
        wordlist,
        mask,
        rules,
        session,
        gpu,
        output,
      })
      setCommand(data.command)
    } catch {}
    setLoading(false)
  }

  const copyCmd = () => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono font-bold text-2xl">Hashcat Command Builder</h1>
        <p className="text-cyber-muted text-sm mt-1">Generate hashcat commands visually — no manual execution</p>
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
              <label className="block font-mono text-xs text-cyber-muted mb-1.5">Attack Mode</label>
              <select value={attackMode} onChange={e => setAttackMode(e.target.value)} className="cyber-input">
                {attackModes.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-mono text-xs text-cyber-muted mb-1.5">Wordlist Path</label>
              <input type="text" value={wordlist} onChange={e => setWordlist(e.target.value)} className="cyber-input" placeholder="/path/to/wordlist.txt" />
            </div>
            <div>
              <label className="block font-mono text-xs text-cyber-muted mb-1.5">Mask (for mask attack)</label>
              <input type="text" value={mask} onChange={e => setMask(e.target.value)} className="cyber-input" placeholder="?l?l?l?l?d?d" />
            </div>
            <div>
              <label className="block font-mono text-xs text-cyber-muted mb-1.5">Rules File</label>
              <input type="text" value={rules} onChange={e => setRules(e.target.value)} className="cyber-input" placeholder="/usr/share/hashcat/rules/best64.rule" />
            </div>
            <div>
              <label className="block font-mono text-xs text-cyber-muted mb-1.5">Session Name</label>
              <input type="text" value={session} onChange={e => setSession(e.target.value)} className="cyber-input" placeholder="my_session" />
            </div>
            <div>
              <label className="block font-mono text-xs text-cyber-muted mb-1.5">GPU Device (-d)</label>
              <input type="text" value={gpu} onChange={e => setGpu(e.target.value)} className="cyber-input" placeholder="1" />
            </div>
            <div>
              <label className="block font-mono text-xs text-cyber-muted mb-1.5">Output File (-o)</label>
              <input type="text" value={output} onChange={e => setOutput(e.target.value)} className="cyber-input" placeholder="cracked.txt" />
            </div>
          </div>

          <Button variant="primary" onClick={generate} className="w-full" disabled={loading}>
            <Cpu className="w-4 h-4" /> {loading ? 'Generating...' : 'Generate Command'}
          </Button>
        </CardContent>
      </Card>

      {command && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Terminal className="w-4 h-4" /> Generated Command</CardTitle>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowHelp(!showHelp)} className="text-cyber-muted hover:text-cyber-text">
                    <Info className="w-4 h-4" />
                  </button>
                  <button onClick={copyCmd} className="p-1.5 rounded-md hover:bg-cyber-panel">
                    {copied ? <CheckCircle className="w-4 h-4 text-cyber-green" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="terminal-dot bg-red-500" />
                  <div className="terminal-dot bg-yellow-500" />
                  <div className="terminal-dot bg-green-500" />
                  <span className="font-mono text-xs text-cyber-muted ml-2">hashcat</span>
                </div>
                <div className="terminal-body">
                  <span className="text-cyber-muted">$ </span>
                  <span className="text-cyber-green">{command}</span>
                </div>
              </div>
              {showHelp && (
                <div className="mt-3 p-3 rounded-lg bg-cyber-cyan/5 border border-cyber-cyan/20 text-xs text-cyber-muted">
                  <p className="font-semibold text-cyber-cyan mb-1">⚠️ No automatic execution</p>
                  <p>This command is generated for reference. Copy and run it manually in your terminal with the actual hash file.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
