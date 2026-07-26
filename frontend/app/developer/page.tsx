'use client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Code2, User, GitBranch, ExternalLink, Sparkles, ChevronRight, Zap, Shield } from 'lucide-react'

export default function Developer() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono font-bold text-2xl">Developer</h1>
        <p className="text-cyber-muted text-sm mt-1">About the creator & how RobinCracker was built</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Code2 className="w-4 h-4" /> Developer Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-mono font-bold text-lg text-cyber-text">Ajit Pawara</p>
                <p className="text-xs text-cyber-muted">Full Stack Developer · Cybersecurity Enthusiast</p>
                <div className="flex items-center gap-3 mt-2">
                  <a href="https://github.com/Ajit-pawara" target="_blank" rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 text-xs text-cyber-cyan hover:text-cyber-green transition-colors">
                    <GitBranch className="w-3.5 h-3.5" /> @Ajit-pawara
                  </a>
                  <span className="text-cyber-muted text-xs">·</span>
                  <a href="https://ajit-pawara.github.io/Portfolio/" target="_blank" rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 text-xs text-cyber-cyan hover:text-cyber-green transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" /> Portfolio
                  </a>
                </div>
              </div>
            </div>

            <details className="group">
              <summary className="cursor-pointer font-mono text-sm text-cyber-text hover:text-cyber-cyan transition-colors flex items-center gap-2 list-none [&::-webkit-details-marker]:hidden">
                <Sparkles className="w-4 h-4 text-cyber-cyan" />
                How RobinCracker was built
                <ChevronRight className="w-4 h-4 ml-auto transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-3 p-4 rounded-xl bg-cyber-bg/50 border border-cyber-edge space-y-3 text-sm text-cyber-muted leading-relaxed">
                <p><strong className="text-cyber-text">RobinCracker</strong> was built as part of my <strong className="text-cyber-text">90-Day Cybersecurity Portfolio</strong> — Day 20: Password Security &amp; Hashing Attacks.</p>

                <p>The idea was simple: instead of just learning hash cracking, build a tool that makes the entire workflow visual and accessible. What started as a command-line lesson turned into a full-stack web app.</p>

                <ul className="space-y-1.5 list-disc list-inside text-cyber-muted">
                  <li><strong className="text-cyber-text">Frontend:</strong> Next.js 14 + TypeScript + TailwindCSS + Framer Motion</li>
                  <li><strong className="text-cyber-text">Backend:</strong> FastAPI (Python) + SQLite + bcrypt</li>
                  <li><strong className="text-cyber-text">Deployment:</strong> Vercel (frontend) + Render (backend)</li>
                  <li><strong className="text-cyber-text">Time:</strong> Built over several sessions, iterating feature by feature</li>
                  <li><strong className="text-cyber-text">Features:</strong> 16 modules — hash ID, analysis, password strength, cracking commands, benchmark, dictionary manager, and more</li>
                </ul>

                <p className="text-cyber-green/80">🎯 Goal: Make password security auditing accessible to everyone — from CTF players to professional pentesters.</p>
              </div>
            </details>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-xs text-cyber-muted">
                Built with Next.js 14 + FastAPI · Deployed on Vercel + Render · 
                <a href="https://github.com/Ajit-pawara/RobinCracker" target="_blank" rel="noopener noreferrer" 
                  className="text-cyber-cyan hover:underline ml-1">
                  Source Code <ExternalLink className="w-3 h-3 inline" />
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="w-4 h-4" /> Tech Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Frontend', value: 'Next.js 14' },
              { label: 'Language', value: 'TypeScript' },
              { label: 'Styling', value: 'TailwindCSS' },
              { label: 'Animation', value: 'Framer Motion' },
              { label: 'Backend', value: 'FastAPI' },
              { label: 'Database', value: 'SQLite' },
              { label: 'Deploy FE', value: 'Vercel' },
              { label: 'Deploy BE', value: 'Render' },
            ].map((t, i) => (
              <div key={i} className="p-3 rounded-lg bg-cyber-bg/50 border border-cyber-edge text-center">
                <div className="text-xs text-cyber-muted">{t.label}</div>
                <div className="font-mono text-sm font-bold text-cyber-text mt-1">{t.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
