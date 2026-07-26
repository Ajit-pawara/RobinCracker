'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, Hash, Shield, Zap, Cpu, BookOpen, Terminal, ArrowRight, Star } from "lucide-react"
import MatrixRain from '@/components/ui/MatrixRain'

const features = [
  { icon: Hash, title: 'Hash Identifier', desc: 'Auto-detect 20+ hash algorithms with confidence scoring', color: 'from-cyber-green/20 to-cyber-green/5', border: 'border-cyber-green/30' },
  { icon: Shield, title: 'Password Strength', desc: 'Entropy analysis & crack time estimation across GPU speeds', color: 'from-cyber-cyan/20 to-cyber-cyan/5', border: 'border-cyber-cyan/30' },
  { icon: Cpu, title: 'Command Builder', desc: 'Generate Hashcat & John the Ripper commands visually', color: 'from-cyber-purple/20 to-cyber-purple/5', border: 'border-cyber-purple/30' },
  { icon: Zap, title: 'Benchmark Dashboard', desc: 'Compare algorithm speeds — MD5 to Argon2id', color: 'from-cyber-amber/20 to-cyber-amber/5', border: 'border-cyber-amber/30' },
  { icon: BookOpen, title: 'Dictionary Manager', desc: 'Upload, browse & analyze custom wordlists', color: 'from-cyber-pink/20 to-cyber-pink/5', border: 'border-cyber-pink/30' },
  { icon: Terminal, title: 'Terminal Simulator', desc: 'Practice hashcat/john commands safely', color: 'from-cyber-red/20 to-cyber-red/5', border: 'border-cyber-red/30' },
]

export default function LandingPage() {
  const [typed, setTyped] = useState('')
  const fullText = 'hashcat -m 0 -a 0 hash.txt rockyou.txt'

  useEffect(() => {
    if (typed.length < fullText.length) {
      const timeout = setTimeout(() => setTyped(fullText.slice(0, typed.length + 1)), 50)
      return () => clearTimeout(timeout)
    }
  }, [typed])

  return (
    <div className="relative min-h-screen overflow-hidden">
      <MatrixRain />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 z-[1] bg-black/40 pointer-events-none" />
      <div className="absolute inset-0 z-[2] bg-blue-soft pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-glow pointer-events-none" />
      
      {/* Nav bar */}
      <nav className="relative z-10 flex items-center justify-between px-4 md:px-6 py-3 md:py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-green to-cyber-cyan flex items-center justify-center">
            <span className="font-mono font-bold text-sm text-cyber-bg">RC</span>
          </div>
          <span className="font-mono font-bold text-lg text-cyber-text">RobinCracker</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="cyber-button text-xs px-5 py-2">
            Launch App
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-12 md:pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="glass-hero-text inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#070a0b]/80 border border-cyber-edge/50 text-cyan-300 font-mono text-xs mb-5 shadow-lg shadow-black/30">
            <Star className="w-3 h-3" /> Open Source · Cybersecurity Toolkit
          </div>
          <div className="glass-hero-box px-4 md:px-8 py-5 md:py-7 rounded-xl bg-[#070a0b]/80 border border-cyber-edge/50 shadow-lg shadow-black/30 mb-6">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-mono font-bold leading-tight text-glow-white">
              Robin<span className="text-cyber-green text-glow-green">Cracker</span>
            </h1>
          </div>
          <div className="glass-hero-box px-4 md:px-8 py-4 md:py-5 rounded-xl bg-[#070a0b]/80 border border-cyber-edge/50 shadow-lg shadow-black/30 mb-8">
            <p className="text-sm md:text-lg lg:text-xl text-cyber-text/80 max-w-3xl mx-auto">
              Professional Password Hash Analysis Toolkit — identify, analyze, and generate cracking commands with enterprise-grade UI.
            </p>
          </div>

          {/* Terminal */}
          <div className="max-w-xl mx-auto mb-10">
            <div className="terminal-window shadow-lg shadow-blue-500/5 border-blue-500/20">
              <div className="terminal-header">
                <div className="terminal-dot bg-red-500" />
                <div className="terminal-dot bg-yellow-500" />
                <div className="terminal-dot bg-green-500" />
                <span className="font-mono text-xs text-cyber-text/60 ml-2">robin@cracker:~$</span>
              </div>
              <div className="terminal-body min-h-[60px]">
                <span className="text-cyber-text/60">$ </span>
                <span>{typed}</span>
                <span className="animate-blink border-r-2 border-cyber-green ml-0.5" />
              </div>
            </div>
          </div>

          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cyber-button text-base px-10 py-4 shadow-lg shadow-cyber-green/10"
            >
              Enter Dashboard
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pb-12 md:pb-20">
        <div className="text-center mb-12">
          <div className="inline-block glass-hero-box px-6 py-3 rounded-xl bg-[#070a0b]/80 border border-cyber-edge/50 shadow-lg shadow-black/30">
            <h2 className="font-mono font-bold text-lg md:text-2xl mb-1 text-glow-cyan">16 Professional Modules</h2>
            <p className="text-cyber-text/70 mt-1">Everything you need for hash analysis and password security auditing</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className={`glass-card p-6 border ${f.border} bg-gradient-to-br ${f.color}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyber-bg/50 border border-cyber-edge flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-cyber-text" />
                </div>
                <h3 className="font-mono font-bold text-sm text-cyber-text/90">{f.title}</h3>
              </div>
              <p className="text-sm text-cyber-text/70">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 pb-12 md:pb-20">
        <div className="glass rounded-2xl p-8 border border-cyber-cyan/20 shadow-lg shadow-blue-500/5">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="font-mono text-2xl md:text-3xl font-bold text-cyber-green">16</div>
              <div className="font-mono text-xs text-cyber-text/60 mt-1">Modules</div>
            </div>
            <div>
              <div className="font-mono text-2xl md:text-3xl font-bold text-cyber-cyan">20+</div>
              <div className="font-mono text-xs text-cyber-text/60 mt-1">Hash Algorithms</div>
            </div>
            <div>
              <div className="font-mono text-2xl md:text-3xl font-bold text-cyber-amber">100%</div>
              <div className="font-mono text-xs text-cyber-text/60 mt-1">Open Source</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cyber-edge py-8 text-center">
        <p className="font-mono text-xs text-cyber-text/50">
          RobinCracker 2026 · Built with Next.js · FastAPI · TypeScript
        </p>
      </footer>
    </div>
  )
}
