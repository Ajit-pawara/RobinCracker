'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Library, BookOpen, AlertTriangle, Shield, Clock, Hash, Zap, Cpu } from 'lucide-react'

const algorithms = [
  {
    name: 'MD5', modes: '-m 0', bits: 128, speed: '60 billion/sec',
    created: 1991, broken: true,
    use_case: 'Checksums, file integrity (NOT passwords)',
    weakness: 'Collision attacks practical since 2004. Chosen-prefix collisions in seconds.',
    recommendation: 'Do NOT use for security. Use SHA-256 for integrity, bcrypt/Argon2 for passwords.',
    history: 'Designed by Ron Rivest in 1991. First major collision attack published in 2004 by Wang et al. By 2008, MD5 collisions could be generated in minutes on consumer hardware. Flame malware (2012) used an MD5 collision to fake a Microsoft digital signature.'
  },
  {
    name: 'SHA-1', modes: '-m 100', bits: 160, speed: '20 billion/sec',
    created: 1995, broken: true,
    use_case: 'Legacy integrity checks, Git commit IDs',
    weakness: 'SHAttered attack (2017) — first practical collision. $110K GPU cost to generate.',
    recommendation: 'Deprecated by all major browsers (2017). Migrate to SHA-256 or SHA-512.',
    history: 'Published by NIST in 1995. The SHAttered attack by Google and CWI Amsterdam in 2017 produced the first SHA-1 collision. GitHub migrated from SHA-1 to SHA-256 for commit integrity in 2017.'
  },
  {
    name: 'SHA-256', modes: '-m 1400', bits: 256, speed: '10 billion/sec',
    created: 2001, broken: false,
    use_case: 'Digital signatures, TLS certificates, blockchain',
    weakness: 'Fast — not suitable for password storage without many iterations + salt.',
    recommendation: 'Excellent for integrity and signatures. For passwords: use many iterations (PBKDF2) or use bcrypt/Argon2 instead.',
    history: 'Part of the SHA-2 family published by NIST in 2001. Bitcoin uses SHA-256 as its proof-of-work algorithm. No practical attacks exist as of 2026.'
  },
  {
    name: 'SHA-512', modes: '-m 1700', bits: 512, speed: '4 billion/sec',
    created: 2001, broken: false,
    use_case: 'High-security integrity, SHA-2 family',
    weakness: 'Longer output but still fast — same password storage caveat as SHA-256.',
    recommendation: 'Use for high-integrity requirements. For passwords: use sha512crypt (-m 1800) or bcrypt.',
    history: 'Same SHA-2 family as SHA-256. Produces 512-bit (64-byte) digests. No practical attacks as of 2026.'
  },
  {
    name: 'bcrypt', modes: '-m 3200', bits: 448, speed: '25,000/sec (cost 12)',
    created: 1999, broken: false,
    use_case: 'Password storage — the industry standard for 20+ years',
    weakness: 'Not memory-hard — GPU attacks can parallelize to some extent.',
    recommendation: 'Use cost factor >= 10. For new systems, consider Argon2id for memory-hardness.',
    history: 'Designed by Niels Provos and David Mazières in 1999. Based on the Blowfish cipher. The cost factor parameter makes it deliberately slow — each increment doubles the work. Used by Facebook, Twitter, GitHub, and countless others.'
  },
  {
    name: 'Argon2id', modes: '-m 29300', bits: 512, speed: '5,000-10,000/sec',
    created: 2015, broken: false,
    use_case: 'Modern password storage — winner of Password Hashing Competition',
    weakness: 'Newer than bcrypt — less battle-tested but academically reviewed.',
    recommendation: 'Current best practice. Use m=64MB, t=3, p=4 for strong protection.',
    history: 'Winner of the Password Hashing Competition (2013-2015). Designed by Alex Biryukov, Daniel Dinu, and Dmitry Khovratovich. Argon2id is the hybrid variant that provides both side-channel and time-memory trade-off resistance.'
  },
]

export default function Learning() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono font-bold text-2xl">Learning Center</h1>
        <p className="text-cyber-muted text-sm mt-1">Deep reference for hash algorithms — use cases, weaknesses, and history</p>
      </div>

      <Tabs defaultTab="algorithms">
        <TabsList>
          <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
        </TabsList>

        <TabsContent value="algorithms">
          <div className="grid gap-4">
            {algorithms.map((algo, i) => (
              <motion.div
                key={algo.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={`border-l-4 ${algo.broken ? 'border-l-cyber-red' : 'border-l-cyber-green'}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-mono font-bold text-lg">{algo.name}</h3>
                          <Badge variant={algo.broken ? 'danger' : 'success'}>
                            {algo.broken ? 'Broken' : 'Secure'}
                          </Badge>
                          <Badge variant="default">{algo.bits} bits</Badge>
                        </div>
                        <p className="text-sm text-cyber-muted mt-1">{algo.use_case}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-cyber-muted">Hashcat mode: </span>
                        <code className="text-cyber-cyan">{algo.modes}</code>
                      </div>
                      <div>
                        <span className="text-cyber-muted">Speed: </span>
                        <span className="font-mono">{algo.speed}</span>
                      </div>
                      <div>
                        <span className="text-cyber-muted">Created: </span>
                        <span>{algo.created}</span>
                      </div>
                    </div>

                    {algo.weakness && (
                      <div className="mt-3 p-3 rounded-lg bg-cyber-amber/5 border border-cyber-amber/20">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-cyber-amber mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-cyber-amber">Weakness</p>
                            <p className="text-xs text-cyber-muted mt-0.5">{algo.weakness}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-3 p-3 rounded-lg bg-cyber-cyan/5 border border-cyber-cyan/20">
                      <div className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-cyber-cyan mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-cyber-cyan">Recommendation</p>
                          <p className="text-xs text-cyber-muted mt-0.5">{algo.recommendation}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs font-semibold text-cyber-text flex items-center gap-2">
                        <BookOpen className="w-3 h-3" /> History
                      </p>
                      <p className="text-xs text-cyber-muted mt-1">{algo.history}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Algorithm Comparison Table</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr className="border-b border-cyber-edge">
                      <th className="text-left py-3 px-3">Algorithm</th>
                      <th className="text-right py-3 px-3">Bits</th>
                      <th className="text-right py-3 px-3">Hashcat -m</th>
                      <th className="text-right py-3 px-3">Crack Speed</th>
                      <th className="text-center py-3 px-3">Broken?</th>
                      <th className="text-left py-3 px-3">Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    {algorithms.map(a => (
                      <tr key={a.name} className="border-b border-cyber-edge/50 hover:bg-cyber-panel/30">
                        <td className="py-3 px-3 font-bold">{a.name}</td>
                        <td className="text-right py-3 px-3">{a.bits}</td>
                        <td className="text-right py-3 px-3 text-cyber-cyan">{a.modes}</td>
                        <td className="text-right py-3 px-3 text-cyber-amber">{a.speed}</td>
                        <td className="text-center py-3 px-3">
                          <Badge variant={a.broken ? 'danger' : 'success'}>{a.broken ? 'Yes' : 'No'}</Badge>
                        </td>
                        <td className="py-3 px-3 text-xs text-cyber-muted">{a.use_case}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="best-practices">
          <Card>
            <CardHeader>
              <CardTitle>Password Storage Best Practices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-cyber-green/5 border border-cyber-green/20">
                <h4 className="font-mono font-bold text-sm text-cyber-green mb-2">✅ DO</h4>
                <ul className="space-y-2 text-sm text-cyber-muted">
                  <li>• Use Argon2id with m=64MB, t=3, p=4 — current best practice</li>
                  <li>• Use bcrypt with cost factor ≥ 10 — industry standard</li>
                  <li>• Always use a unique, random salt per password</li>
                  <li>• Check passwords against breach databases (HaveIBeenPwned API)</li>
                  <li>• Enforce minimum 12-character password length</li>
                  <li>• Rate-limit login attempts</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-cyber-red/5 border border-cyber-red/20">
                <h4 className="font-mono font-bold text-sm text-cyber-red mb-2">❌ DON'T</h4>
                <ul className="space-y-2 text-sm text-cyber-muted">
                  <li>• Never use MD5, SHA-1, or unsalted SHA-256 for passwords</li>
                  <li>• Never store passwords in plaintext</li>
                  <li>• Never use fast hashes without thousands of iterations</li>
                  <li>• Never roll your own cryptography</li>
                  <li>• Never limit password length or character set arbitrarily</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-cyber-amber/5 border border-cyber-amber/20">
                <h4 className="font-mono font-bold text-sm text-cyber-amber mb-2">📊 The Speed Gap</h4>
                <p className="text-sm text-cyber-muted">
                  The difference between MD5 (60 billion/sec) and bcrypt (25,000/sec) is <strong className="text-cyber-amber">2.4 million times</strong>. 
                  Against bcrypt, cracking a database of 10,000 user passwords with rockyou.txt + one rule would take <strong className="text-cyber-red">~11.4 years</strong>. 
                  Against MD5, the same task takes <strong className="text-cyber-green">~2 minutes</strong>. 
                  Algorithm choice is the single most important security decision in password storage.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
