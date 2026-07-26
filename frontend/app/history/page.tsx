'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { History as HistoryIcon, Clock, Trash2, Hash, Shield, Cpu, FileText } from 'lucide-react'

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.getHistory(100)
      setHistory(data.history || [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const typeIcon = (t: string) => {
    switch(t) {
      case 'identify': return <Hash className="w-4 h-4 text-cyber-green" />
      case 'analyze': return <FileText className="w-4 h-4 text-cyber-cyan" />
      case 'strength': return <Shield className="w-4 h-4 text-cyber-amber" />
      default: return <Cpu className="w-4 h-4 text-cyber-purple" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono font-bold text-2xl">History</h1>
          <p className="text-cyber-muted text-sm mt-1">Your recent hash analyses and tool usage</p>
        </div>
        <button onClick={load} className="cyber-button text-xs px-4 py-2">
          <Clock className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin mb-4" />
              <p className="font-mono text-sm text-cyber-muted">Loading...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-16">
              <HistoryIcon className="w-12 h-12 text-cyber-muted/30 mx-auto mb-4" />
              <p className="font-mono text-sm text-cyber-muted">No history yet</p>
              <p className="text-xs text-cyber-muted/50 mt-1">Start analyzing hashes — your activity will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-cyber-edge">
              {history.map((item: any, i: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-center gap-4 p-4 hover:bg-cyber-panel/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-cyber-panel/50 border border-cyber-edge flex items-center justify-center">
                    {typeIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="uppercase text-[10px]">{item.type}</Badge>
                      <span className="font-mono text-xs text-cyber-muted truncate">{item.input}</span>
                    </div>
                    <div className="text-xs text-cyber-muted/50 mt-0.5">{item.created_at}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
