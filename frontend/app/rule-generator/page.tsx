'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { api } from '@/lib/api'
import { Sliders, Copy, CheckCircle, FileDown, FlaskConical } from 'lucide-react'

export default function RuleGenerator() {
  const [baseWord, setBaseWord] = useState('password')
  const [ruleType, setRuleType] = useState('common')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    setLoading(true)
    try {
      const data = await api.generateRules(baseWord, ruleType)
      setResult(data)
    } catch {}
    setLoading(false)
  }

  const copyAll = () => {
    if (!result) return
    const text = result.rules.map((r: any) => r.rule + '  # ' + r.desc).join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const exportRules = () => {
    if (!result) return
    const text = result.rules.map((r: any) => r.rule).join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${baseWord}_${ruleType}.rule`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono font-bold text-2xl">Rule Generator</h1>
        <p className="text-cyber-muted text-sm mt-1">Generate Hashcat-compatible mutation rules and preview transformations</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={baseWord}
              onChange={e => setBaseWord(e.target.value)}
              placeholder="Base word (e.g., password)"
              className="cyber-input flex-1"
            />
            <Button variant="primary" onClick={generate} disabled={loading || !baseWord}>
              <Sliders className="w-4 h-4" /> Generate
            </Button>
          </div>

          <Tabs defaultTab="common">
            <TabsList>
              <TabsTrigger value="common">Common Mutations</TabsTrigger>
              <TabsTrigger value="leet">Leet Speak</TabsTrigger>
              <TabsTrigger value="hashcat_rules">Hashcat Rules</TabsTrigger>
            </TabsList>
            <TabsContent value="common">
              <p className="text-xs text-cyber-muted">Common password transformation patterns</p>
            </TabsContent>
            <TabsContent value="leet">
              <p className="text-xs text-cyber-muted">Leet speak character substitutions</p>
            </TabsContent>
            <TabsContent value="hashcat_rules">
              <p className="text-xs text-cyber-muted">Full Hashcat rule syntax reference — use with `-r rules.rule`</p>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2">
            <button
              onClick={() => setRuleType('common')}
              className={`px-3 py-1.5 rounded-md font-mono text-xs border transition-all ${ruleType === 'common' ? 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green' : 'bg-cyber-panel border-cyber-edge text-cyber-muted hover:text-cyber-text'}`}
            >
              Common
            </button>
            <button
              onClick={() => setRuleType('leet')}
              className={`px-3 py-1.5 rounded-md font-mono text-xs border transition-all ${ruleType === 'leet' ? 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green' : 'bg-cyber-panel border-cyber-edge text-cyber-muted hover:text-cyber-text'}`}
            >
              Leet Speak
            </button>
            <button
              onClick={() => setRuleType('hashcat_rules')}
              className={`px-3 py-1.5 rounded-md font-mono text-xs border transition-all ${ruleType === 'hashcat_rules' ? 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green' : 'bg-cyber-panel border-cyber-edge text-cyber-muted hover:text-cyber-text'}`}
            >
              Hashcat Syntax
            </button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="w-4 h-4" /> Mutations for "{result.base_word}"
                </CardTitle>
                <div className="flex items-center gap-2">
                  <button onClick={copyAll} className="p-1.5 rounded-md hover:bg-cyber-panel text-cyber-muted hover:text-cyber-text">
                    {copied ? <CheckCircle className="w-4 h-4 text-cyber-green" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button onClick={exportRules} className="p-1.5 rounded-md hover:bg-cyber-panel text-cyber-muted hover:text-cyber-text">
                    <FileDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {result.rules.map((r: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded hover:bg-cyber-panel/30 transition-colors">
                    <span className="font-mono text-xs text-cyber-muted w-8 text-right">{i + 1}</span>
                    <code className="px-2 py-0.5 rounded bg-cyber-bg border border-cyber-edge text-cyber-cyan font-mono text-xs min-w-[60px]">
                      {r.rule}
                    </code>
                    {r.result && (
                      <code className="px-2 py-0.5 rounded bg-cyber-bg border border-cyber-edge text-cyber-green font-mono text-xs">
                        {r.result}
                      </code>
                    )}
                    <span className="text-xs text-cyber-muted">{r.desc}</span>
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
