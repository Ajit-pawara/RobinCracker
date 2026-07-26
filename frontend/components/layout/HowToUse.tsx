'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ChevronRight, Hash, Shield, Cpu, BookOpen,
  Terminal, CheckCircle, ArrowRight, Sparkles
} from 'lucide-react'

const STORAGE_KEY = 'robincracker-howto-dismissed'

const steps = [
  {
    icon: Hash,
    title: '1. Identify the Hash',
    desc: 'Go to Hash Identifier, paste your hash, and find out what algorithm it uses (MD5, SHA1, bcrypt, etc).',
    link: '/hash-identifier',
    color: 'from-cyber-green/20 to-cyber-green/5',
    border: 'border-cyber-green/30'
  },
  {
    icon: Shield,
    title: '2. Analyze the Hash',
    desc: 'Use Hash Analyzer to check entropy, encoding, character set, and risk level of your hash.',
    link: '/hash-analyzer',
    color: 'from-cyber-cyan/20 to-cyber-cyan/5',
    border: 'border-cyber-cyan/30'
  },
  {
    icon: Cpu,
    title: '3. Hashcat Builder',
    desc: 'Select algorithm + attack mode + wordlist. Click generate — you get a ready-to-run hashcat command.',
    link: '/hashcat-builder',
    color: 'from-cyber-purple/20 to-cyber-purple/5',
    border: 'border-cyber-purple/30'
  },
  {
    icon: Terminal,
    title: '4. Run on Your Machine',
    desc: 'Copy the command and run it in your terminal (Kali/Zorin). Hashcat will crack the hash using your GPU/CPU.',
    link: '/terminal',
    color: 'from-cyber-amber/20 to-cyber-amber/5',
    border: 'border-cyber-amber/30'
  },
  {
    icon: CheckCircle,
    title: '5. Get the Password!',
    desc: 'Hashcat outputs the cracked password. Use it for CTFs, pentests, or password security audits.',
    link: '/history',
    color: 'from-cyber-green/20 to-cyber-green/5',
    border: 'border-cyber-green/30'
  }
]

export default function HowToUse() {
  const [isOpen, setIsOpen] = useState(false)
  const [dismissed, setDismissed] = useState(true)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const val = localStorage.getItem(STORAGE_KEY)
    if (!val) {
      setDismissed(false)
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, 'true')
    }
    setDismissed(true)
    setIsOpen(false)
    setCurrentStep(0)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleClose()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const step = steps[currentStep]
  const StepIcon = step?.icon

  return (
    <>
      {/* Floating help button */}
      <button
        onClick={() => { setIsOpen(true); setDismissed(false) }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-cyber-green to-cyber-cyan 
          flex items-center justify-center shadow-lg shadow-cyber-green/20 hover:shadow-cyber-green/40 
          transition-all duration-300 hover:scale-110 group"
        title="How to use RobinCracker"
      >
        <Sparkles className="w-6 h-6 text-cyber-bg" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyber-red rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
          ?
        </span>
      </button>

      {/* Modal backdrop */}
      <AnimatePresence>
        {isOpen && !dismissed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-cyber-panel border border-cyber-edge rounded-2xl shadow-2xl"
            >
              {/* Header */}
              <div className="sticky top-0 bg-cyber-panel/95 backdrop-blur-sm border-b border-cyber-edge px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyber-green to-cyber-cyan flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-cyber-bg" />
                  </div>
                  <div>
                    <h2 className="font-mono font-bold text-lg text-cyber-text">How to Use RobinCracker</h2>
                    <p className="text-xs text-cyber-muted font-mono">
                      Step {currentStep + 1} of {steps.length}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-lg bg-cyber-bg/50 border border-cyber-edge flex items-center justify-center hover:bg-cyber-red/20 hover:border-cyber-red/50 transition-colors"
                >
                  <X className="w-4 h-4 text-cyber-muted" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="px-6 pt-4">
                <div className="flex gap-1.5">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                        i <= currentStep ? 'bg-gradient-to-r from-cyber-green to-cyber-cyan' : 'bg-cyber-edge'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Step content */}
              <div className="px-6 py-6">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`glass-card p-6 border ${step?.border || 'border-cyber-edge'} 
                    bg-gradient-to-br ${step?.color || ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyber-bg/50 border border-cyber-edge flex items-center justify-center shrink-0">
                      {StepIcon && <StepIcon className="w-6 h-6 text-cyber-text" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-mono font-bold text-lg text-cyber-text mb-2">{step?.title}</h3>
                      <p className="text-sm text-cyber-muted leading-relaxed mb-4">{step?.desc}</p>
                      {step?.link && (
                        <a
                          href={step.link}
                          onClick={(e) => { e.preventDefault(); window.location.href = step.link }}
                          className="inline-flex items-center gap-1.5 text-xs font-mono text-cyber-cyan hover:text-cyber-green transition-colors"
                        >
                          Go to {step.link.replace('/', '')} <ArrowRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Quick summary for last step */}
                {currentStep === steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-cyber-green/5 border border-cyber-green/20"
                  >
                    <p className="text-sm text-cyber-text font-mono">
                      🎯 <strong>Workflow:</strong> Identify → Analyze → Build Command → 
                      <span className="text-cyber-green"> Run Locally</span> → 
                      <span className="text-cyber-cyan"> Password Found!</span>
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-cyber-panel/95 backdrop-blur-sm border-t border-cyber-edge px-6 py-4 rounded-b-2xl">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={dontShowAgain}
                      onChange={(e) => setDontShowAgain(e.target.checked)}
                      className="w-4 h-4 rounded border-cyber-edge bg-cyber-bg text-cyber-green 
                        focus:ring-cyber-green/30 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-xs text-cyber-muted group-hover:text-cyber-text transition-colors">
                      Don't show this again
                    </span>
                  </label>

                  <div className="flex items-center gap-2">
                    {currentStep > 0 && (
                      <button
                        onClick={prevStep}
                        className="px-4 py-2 rounded-lg text-xs font-mono text-cyber-muted 
                          border border-cyber-edge hover:bg-cyber-bg/50 transition-colors"
                      >
                        Back
                      </button>
                    )}
                    <button
                      onClick={nextStep}
                      className="px-5 py-2 rounded-lg text-xs font-mono font-bold text-cyber-bg 
                        bg-gradient-to-r from-cyber-green to-cyber-cyan 
                        hover:from-cyber-green/90 hover:to-cyber-cyan/90 
                        transition-all flex items-center gap-1.5"
                    >
                      {currentStep < steps.length - 1 ? (
                        <>Next <ChevronRight className="w-3.5 h-3.5" /></>
                      ) : (
                        <>Got it! <CheckCircle className="w-3.5 h-3.5" /></>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
