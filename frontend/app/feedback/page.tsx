'use client'
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, Bug, Lightbulb, HelpCircle, Send, CheckCircle, AlertCircle } from 'lucide-react'

export default function Feedback() {
  const [form, setForm] = useState({ type: 'suggestion', message: '', contact: '' })
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.message.trim()) return

    const body = {
      type: form.type,
      message: form.message,
      contact: form.contact,
      page: window.location.href,
      timestamp: new Date().toISOString(),
    }

    // Save to localStorage so dev can see feedback
    const existing = JSON.parse(localStorage.getItem('robin-feedback') || '[]')
    existing.push(body)
    localStorage.setItem('robin-feedback', JSON.stringify(existing))

    setStatus('sent')
    setForm({ type: 'suggestion', message: '', contact: '' })
    setTimeout(() => setStatus('idle'), 3000)
  }

  const types = [
    { id: 'suggestion', label: 'Suggestion', icon: Lightbulb, color: 'text-cyber-green border-cyber-green/30 bg-cyber-green/10' },
    { id: 'bug', label: 'Bug Report', icon: Bug, color: 'text-cyber-red border-cyber-red/30 bg-cyber-red/10' },
    { id: 'query', label: 'Query', icon: HelpCircle, color: 'text-cyber-cyan border-cyber-cyan/30 bg-cyber-cyan/10' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono font-bold text-2xl">Feedback</h1>
        <p className="text-cyber-muted text-sm mt-1">Suggestions, bug reports, or queries — I read every message</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Send Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'sent' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="w-12 h-12 text-cyber-green mb-4" />
              <p className="font-mono font-bold text-lg text-cyber-text">Thank you!</p>
              <p className="text-sm text-cyber-muted mt-1">Your feedback has been recorded.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Type selector */}
              <div>
                <p className="font-mono text-sm mb-3">Type</p>
                <div className="flex gap-3">
                  {types.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setForm({ ...form, type: t.id })}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-mono transition-all ${
                        form.type === t.id ? t.color + ' ring-1' : 'border-cyber-edge text-cyber-muted hover:border-cyber-cyan/30'
                      }`}
                    >
                      <t.icon className="w-3.5 h-3.5" />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <p className="font-mono text-sm mb-2">Your Message</p>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your suggestion, bug, or question..."
                  rows={5}
                  className="w-full bg-cyber-bg border border-cyber-edge rounded-lg px-4 py-3 text-sm text-cyber-text font-mono placeholder:text-cyber-muted/50 focus:outline-none focus:border-cyber-cyan/40 resize-none"
                  required
                />
              </div>

              {/* Contact */}
              <div>
                <p className="font-mono text-sm mb-2">Contact (optional)</p>
                <input
                  type="text"
                  value={form.contact}
                  onChange={e => setForm({ ...form, contact: e.target.value })}
                  placeholder="Email, GitHub handle, or leave blank"
                  className="w-full bg-cyber-bg border border-cyber-edge rounded-lg px-4 py-2.5 text-sm text-cyber-text font-mono placeholder:text-cyber-muted/50 focus:outline-none focus:border-cyber-cyan/40"
                />
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-cyber-red">
                  <AlertCircle className="w-4 h-4" /> Something went wrong. Please try again.
                </div>
              )}

              <Button type="submit" variant="primary" size="lg" className="w-full">
                <Send className="w-4 h-4" /> Send Feedback
              </Button>

              <p className="text-xs text-cyber-muted text-center">
                Your feedback is stored locally. The developer checks this regularly.
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
