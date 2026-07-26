'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Hash, Zap, Shield, Clock, Activity, TrendingUp, Cpu, Database } from 'lucide-react'
import Link from 'next/link'

const quickLinks = [
  { href: '/hash-identifier', label: 'Identify Hash', icon: Hash, color: 'text-cyber-green', desc: 'Paste a hash to identify its algorithm' },
  { href: '/password-strength', label: 'Check Password', icon: Shield, color: 'text-cyber-cyan', desc: 'Test password entropy & crack time' },
  { href: '/hashcat-builder', label: 'Build Command', icon: Cpu, color: 'text-cyber-purple', desc: 'Generate Hashcat commands visually' },
  { href: '/benchmark', label: 'View Benchmarks', icon: TrendingUp, color: 'text-cyber-amber', desc: 'Compare hash algorithm speeds' },
]

export default function Dashboard() {
  const [time, setTime] = useState('')
  const [historyCount, setHistoryCount] = useState(0)

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleString('en-US', { hour12: false }))
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  const stats = [
    { label: 'Analysis Today', value: '0', icon: Activity, color: 'text-cyber-green', border: 'border-cyber-green/30' },
    { label: 'Hash Types Supported', value: '20+', icon: Hash, color: 'text-cyber-cyan', border: 'border-cyber-cyan/30' },
    { label: 'Algorithms Benchmarked', value: '9', icon: Cpu, color: 'text-cyber-purple', border: 'border-cyber-purple/30' },
    { label: 'System Uptime', value: time || 'Loading...', icon: Clock, color: 'text-cyber-amber', border: 'border-cyber-amber/30', small: true },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono font-bold text-2xl">Dashboard</h1>
        <p className="text-cyber-muted text-sm mt-1">Welcome to RobinCracker — your hash analysis command center</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`border ${stat.border}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-cyber-muted uppercase tracking-wider">{stat.label}</span>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className={`font-mono font-bold ${stat.small ? 'text-sm' : 'text-2xl'} truncate`}>{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, i) => (
              <Link key={link.href} href={link.href}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="glass-card p-4 cursor-pointer group hover:border-cyber-cyan/40"
                >
                  <link.icon className={`w-8 h-8 ${link.color} mb-3 group-hover:scale-110 transition-transform`} />
                  <h3 className="font-mono font-bold text-sm mb-1">{link.label}</h3>
                  <p className="text-xs text-cyber-muted">{link.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Database className="w-12 h-12 text-cyber-muted/30 mx-auto mb-3" />
            <p className="font-mono text-sm text-cyber-muted">No activity yet</p>
            <p className="text-xs text-cyber-muted/50 mt-1">Start by identifying a hash or checking password strength</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
