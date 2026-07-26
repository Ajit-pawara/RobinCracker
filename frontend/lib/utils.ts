import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function calculateEntropy(str: string): number {
  const len = str.length
  let charset = 0
  if (/[a-z]/.test(str)) charset += 26
  if (/[A-Z]/.test(str)) charset += 26
  if (/[0-9]/.test(str)) charset += 10
  if (/[^a-zA-Z0-9]/.test(str)) charset += 33
  if (charset === 0) return 0
  return Math.round(len * Math.log2(charset))
}

export function calculateCrackTime(entropy: number, speed: number): string {
  const combinations = Math.pow(2, entropy)
  const seconds = combinations / speed
  if (seconds < 1) return 'Instant'
  if (seconds < 60) return `${Math.round(seconds)} seconds`
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`
  if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`
  if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`
  return `${Math.round(seconds / 31536000)} years`
}

export function getStrengthLabel(entropy: number): { label: string; color: string } {
  if (entropy < 30) return { label: 'Very Weak', color: '#ff5c5c' }
  if (entropy < 40) return { label: 'Weak', color: '#ffb454' }
  if (entropy < 60) return { label: 'Moderate', color: '#fdff5c' }
  if (entropy < 80) return { label: 'Strong', color: '#4fd1ff' }
  return { label: 'Very Strong', color: '#39ff88' }
}

export function identifyHash(hash: string): Array<{ algorithm: string; length: number; confidence: number; note: string }> {
  const s = hash.trim()
  const l = s.length
  const results: Array<{ algorithm: string; length: number; confidence: number; note: string }> = []

  if (/^[0-9a-f]{32}$/i.test(s)) results.push({ algorithm: 'MD5', length: 128, confidence: 95, note: 'Most common 128-bit hash' })
  if (/^[0-9a-f]{40}$/i.test(s)) results.push({ algorithm: 'SHA-1', length: 160, confidence: 95, note: '160-bit hash, 40 hex chars' })
  if (/^[0-9a-f]{56}$/i.test(s)) results.push({ algorithm: 'SHA-224', length: 224, confidence: 90, note: '224-bit SHA-2 variant' })
  if (/^[0-9a-f]{64}$/i.test(s)) results.push({ algorithm: 'SHA-256', length: 256, confidence: 95, note: '256-bit SHA-2, 64 hex chars' })
  if (/^[0-9a-f]{96}$/i.test(s)) results.push({ algorithm: 'SHA-384', length: 384, confidence: 90, note: '384-bit SHA-2 variant' })
  if (/^[0-9a-f]{128}$/i.test(s)) results.push({ algorithm: 'SHA-512', length: 512, confidence: 90, note: '512-bit SHA-2, 128 hex chars' })
  if (/^\$2[aby]\$\d{2}\$[.\/A-Za-z0-9]{53}$/.test(s)) results.push({ algorithm: 'bcrypt', length: 448, confidence: 98, note: 'Blowfish-based, $2y$ prefix' })
  if (/^\$argon2(id|i|d)\$v=\d+\$m=\d+,t=\d+,p=\d+\$[.\/A-Za-z0-9]+\$[.\/A-Za-z0-9]+$/.test(s)) results.push({ algorithm: 'Argon2', length: 512, confidence: 95, note: 'Memory-hard modern hash' })
  if (/^[0-9a-f]{32}:[0-9a-f]{1,}$/i.test(s)) results.push({ algorithm: 'NTLM', length: 128, confidence: 85, note: 'Windows NTLM hash with salt' })
  if (/^[0-9a-f]{32}$/i.test(s)) results.push({ algorithm: 'NTLM', length: 128, confidence: 60, note: 'Could be NTLM or MD5' })
  if (/^\$1\$[.\/A-Za-z0-9]{1,8}\$[.\/A-Za-z0-9]{22}$/.test(s)) results.push({ algorithm: 'MD5 Crypt', length: 128, confidence: 95, note: 'Unix MD5 password hash ($1$)' })
  if (/^\$5\$[.\/A-Za-z0-9]{1,16}\$[.\/A-Za-z0-9]{43}$/.test(s)) results.push({ algorithm: 'SHA-256 Crypt', length: 256, confidence: 95, note: 'Unix SHA-256 ($5$)' })
  if (/^\$6\$[.\/A-Za-z0-9]{1,16}\$[.\/A-Za-z0-9]{86}$/.test(s)) results.push({ algorithm: 'SHA-512 Crypt', length: 512, confidence: 95, note: 'Unix SHA-512 ($6$)' })

  return results.length > 0 ? results.sort((a, b) => b.confidence - a.confidence) : [{ algorithm: 'Unknown', length: l * 4, confidence: 10, note: 'Hash format not recognized' }]
}
