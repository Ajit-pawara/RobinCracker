'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Terminal as TerminalIcon, Trash2 } from 'lucide-react'

const responses: Record<string, string[]> = {
  'hashid': [
    'hashid (Hash Identifier) v1.1.0',
    'Usage: hashid [options] <hash>',
    '',
    'Options:',
    '  -m, --mode        Show hashcat mode numbers',
    '  -j, --john        Show John the Ripper format',
    '  -e, --extended    Show extended information',
    '  --help            Show this help',
    '',
    'Example: echo "5f4dcc3b5aa765d61d8327deb882cf99" | hashid',
  ],
  'hashcat -h': [
    'hashcat (v6.2.6) — Advanced Password Recovery',
    'Usage: hashcat [options]... hash|hashfile|hccapxfile [dictionary|mask|directory]...',
    '',
    'Basic Options:',
    '  -m, --hash-type       Hash type (see --example-hashes)',
    '  -a, --attack-mode     Attack mode (0-9)',
    '  -V, --version         Print version',
    '  -h, --help            Print help',
    '',
    'Attack Modes:',
    '  0 = Dictionary',
    '  1 = Combination',
    '  3 = Brute-force (mask)',
    '  6 = Hybrid dict + mask',
    '  7 = Hybrid mask + dict',
    '',
    'Common Example: hashcat -m 0 -a 0 hash.txt rockyou.txt',
  ],
  'john --list=formats': [
    'John the Ripper 1.9.0-jumbo-1 — Format Listing (partial)',
    '  raw-md5            [MD5 128/128 AVX 4x3]',
    '  raw-sha1           [SHA1 128/128]',
    '  raw-sha256         [SHA256 128/128]',
    '  raw-sha512         [SHA512 128/128]',
    '  bcrypt             ["$2y$" Blowfish 256/256]',
    '  sha512crypt        [SHA512 128/128]',
    '  nt                 [NTLM 128/128]',
    '  lm                 [LM 128/128]',
    '',
    'Usage: john --format=<format> --wordlist=<file> hash.txt',
  ],
  'openssl dgst -help': [
    'openssl dgst — Digest calculation command',
    'Usage: openssl dgst [options] [file...]',
    '',
    'Digest Algorithms:',
    '  -md5, -sha1, -sha224, -sha256, -sha384, -sha512',
    '  -blake2b512, -blake2s256, -sm3',
    '',
    'Options:',
    '  -hex              Output as hex string (default)',
    '  -binary           Output as binary',
    '  -out file         Output to file',
    '  -sign keyfile     Sign with private key',
    '  -verify keyfile   Verify with public key',
    '',
    'Example: echo -n "hello" | openssl dgst -sha256',
  ],
  'help': [
    'RobinCracker Terminal Simulator — v1.0.0',
    '',
    'Available commands:',
    '  hashid              Show hashid help',
    '  hashcat -h          Show hashcat help',
    '  john --list=formats Show John formats',
    '  openssl dgst -help  Show openssl digest help',
    '  clear               Clear terminal',
    '  help                Show this message',
    '',
    'This is a SAFE simulation. No actual commands are executed.',
  ],
  'clear': [],
}

export default function TerminalSim() {
  const [lines, setLines] = useState<Array<{ text: string; isOutput?: boolean; isInput?: boolean }>>([
    { text: 'RobinCracker Terminal Simulator v1.0.0', isOutput: true },
    { text: 'Type "help" for available commands.', isOutput: true },
    { text: 'No commands are actually executed — 100% safe.', isOutput: true },
    { text: '', isOutput: true },
    { text: 'robin@cracker:~$ ', isInput: true },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [lines])

  const execute = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    const newLines = [...lines]
    
    // Replace the input line with the actual command
    newLines[newLines.length - 1] = { text: `robin@cracker:~$ ${trimmed}`, isInput: true }
    newLines.push({ text: '', isOutput: true })

    if (trimmed === 'clear') {
      setLines([
        { text: `robin@cracker:~$ clear`, isInput: true },
        { text: '', isOutput: true },
        { text: 'robin@cracker:~$ ', isInput: true },
      ])
      setHistory(h => [...h, trimmed])
      return
    }

    const resp = responses[trimmed]
    if (resp) {
      resp.forEach(line => newLines.push({ text: line, isOutput: true }))
    } else if (trimmed === '') {
      // nothing
    } else {
      newLines.push({ text: `bash: ${cmd.split(' ')[0]}: command not found (simulated)`, isOutput: true })
    }

    newLines.push({ text: '', isOutput: true })
    newLines.push({ text: 'robin@cracker:~$ ', isInput: true })
    setLines(newLines)
    setHistory(h => [...h, trimmed])
    setHistoryIdx(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      execute(input)
      setInput('')
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length > 0) {
        const newIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1)
        setHistoryIdx(newIdx)
        setInput(history[newIdx])
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIdx >= 0) {
        const newIdx = historyIdx + 1
        if (newIdx >= history.length) {
          setHistoryIdx(-1)
          setInput('')
        } else {
          setHistoryIdx(newIdx)
          setInput(history[newIdx])
        }
      }
    }
  }

  return (
    <div className="space-y-6" onClick={() => inputRef.current?.focus()}>
      <div>
        <h1 className="font-mono font-bold text-2xl">Terminal Simulator</h1>
        <p className="text-cyber-muted text-sm mt-1">Practice hashcat, john, and openssl commands safely — nothing is executed</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="terminal-window border-0 rounded-xl">
            <div className="terminal-header">
              <div className="terminal-dot bg-red-500" />
              <div className="terminal-dot bg-yellow-500" />
              <div className="terminal-dot bg-green-500" />
              <span className="font-mono text-xs text-cyber-muted ml-2">robin@cracker:~/simulator$</span>
              <button
                onClick={() => execute('clear')}
                className="ml-auto p-1 rounded hover:bg-cyber-panel text-cyber-muted hover:text-cyber-text transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="terminal-body min-h-[400px] max-h-[500px] overflow-y-auto" onClick={() => inputRef.current?.focus()}>
              {lines.map((line, i) => (
                <div key={i} className={`${line.isInput ? 'flex' : ''}`}>
                  {line.isInput ? (
                    <span>{line.text}</span>
                  ) : (
                    <span className={line.text.startsWith('bash:') ? 'text-cyber-red' : line.text.startsWith('Usage') || line.text.startsWith('  -') ? 'text-cyber-cyan' : ''}>
                      {line.text}
                    </span>
                  )}
                </div>
              ))}
              {/* Inline input */}
              <div className="flex items-center mt-0">
                <span className="text-cyber-green shrink-0">robin@cracker:~$ </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-cyber-text ml-0"
                  spellCheck={false}
                  autoComplete="off"
                />
                <span className="animate-blink border-r-2 border-cyber-green h-4" />
              </div>
              <div ref={bottomRef} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
