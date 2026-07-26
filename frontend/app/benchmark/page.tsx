'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { api } from '@/lib/api'
import { BarChart3, Cpu, Zap, AlertTriangle, TrendingDown } from 'lucide-react'

export default function Benchmark() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.benchmark()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  const maxSpeed = data?.algorithms ? Math.max(...data.algorithms.map((a: any) => a.speed_mh)) : 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono font-bold text-2xl">Benchmark Dashboard</h1>
        <p className="text-cyber-muted text-sm mt-1">Compare hash algorithm speeds — estimated on modern GPU (RTX 4090)</p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-mono text-sm text-cyber-muted">Loading benchmark data...</p>
        </div>
      )}

      {data && (
        <div className="space-y-4">
          {/* Header card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-sm text-cyber-muted">
                <AlertTriangle className="w-4 h-4 text-cyber-amber" />
                <span>Estimated speeds on modern GPU (RTX 4090). Actual speeds vary by hardware.</span>
              </div>
            </CardContent>
          </Card>

          {/* GPU Speed Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Zap className="w-4 h-4 text-cyber-green" /> GPU Speed (MH/s) — Logarithmic Scale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.algorithms.map((algo: any, i: number) => {
                  const pct = Math.log10(algo.speed_mh + 1) / Math.log10(maxSpeed + 1) * 100
                  const color = algo.speed_mh > 1000 ? 'bg-cyber-red' : algo.speed_mh > 1 ? 'bg-cyber-amber' : 'bg-cyber-green'
                  return (
                    <motion.div
                      key={algo.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-36 text-right">
                          <span className="font-mono text-sm font-bold">{algo.name}</span>
                        </div>
                        <div className="flex-1">
                          <div className="h-8 rounded-md bg-cyber-bg border border-cyber-edge overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.max(1, pct)}%` }}
                              transition={{ duration: 1, delay: i * 0.1 }}
                              className={`h-full ${color} opacity-80 rounded-r-sm flex items-center justify-end px-2`}
                            >
                              <span className="font-mono text-xs text-white font-bold">{algo.speed_per_sec}/s</span>
                            </motion.div>
                          </div>
                        </div>
                        <Badge variant={algo.speed_mh > 1000 ? 'danger' : algo.speed_mh > 1 ? 'warning' : 'success'}>
                          {algo.speed_mh >= 1000 ? `${(algo.speed_mh / 1000).toFixed(1)} B` : algo.speed_mh >= 1 ? `${algo.speed_mh.toFixed(0)} M` : `${(algo.speed_mh * 1000).toFixed(1)} K`}/s
                        </Badge>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Table View */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Cpu className="w-4 h-4" /> Full Comparison Table</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr className="border-b border-cyber-edge">
                      <th className="text-left py-3 px-3 text-cyber-muted font-semibold">Algorithm</th>
                      <th className="text-right py-3 px-3 text-cyber-muted font-semibold">Hashcat Mode</th>
                      <th className="text-right py-3 px-3 text-cyber-muted font-semibold">GPU Speed</th>
                      <th className="text-right py-3 px-3 text-cyber-muted font-semibold">CPU Speed</th>
                      <th className="text-right py-3 px-3 text-cyber-muted font-semibold">vs MD5</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.algorithms.map((algo: any, i: number) => (
                      <tr key={algo.name} className="border-b border-cyber-edge/50 hover:bg-cyber-panel/30 transition-colors">
                        <td className="py-3 px-3 font-bold">{algo.name}</td>
                        <td className="text-right py-3 px-3 text-cyber-cyan">-m {algo.hashcat_mode}</td>
                        <td className="text-right py-3 px-3">{algo.gpu_speed}</td>
                        <td className="text-right py-3 px-3">{algo.cpu_speed}</td>
                        <td className="text-right py-3 px-3">
                          <Badge variant={algo.relative_speed < 0.01 ? 'success' : algo.relative_speed < 0.5 ? 'warning' : 'danger'}>
                            {algo.relative_speed < 0.001 ? `< 0.001x` : `${algo.relative_speed.toFixed(2)}x`}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Key insight */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <TrendingDown className="w-5 h-5 text-cyber-red mt-0.5" />
                <div>
                  <p className="font-mono font-bold text-sm mb-1">The Speed Gap is Everything</p>
                  <p className="text-sm text-cyber-muted">
                    MD5: 60 <strong className="text-cyber-red">billion</strong> hashes/sec. bcrypt (cost 12): 25 <strong className="text-cyber-green">thousand</strong>/sec. 
                    That's <strong className="text-cyber-amber">2.4 million times</strong> slower. 
                    This is why algorithm choice determines whether a breach is catastrophic or contained.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!loading && !data && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="font-mono text-sm text-cyber-muted">Failed to load benchmark data. Is the backend running?</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
