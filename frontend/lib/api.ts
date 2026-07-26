const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function apiPost(endpoint: string, data: Record<string, string>) {
  const formData = new FormData()
  Object.entries(data).forEach(([k, v]) => formData.append(k, v))
  const res = await fetch(`${API_URL}${endpoint}`, { method: 'POST', body: formData })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

async function apiGet(endpoint: string) {
  const res = await fetch(`${API_URL}${endpoint}`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

async function apiUpload(endpoint: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${API_URL}${endpoint}`, { method: 'POST', body: formData })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const api = {
  identify: (hash: string) => apiPost('/api/identify', { hash }),
  analyze: (hash: string) => apiPost('/api/analyze', { hash }),
  passwordStrength: (password: string) => apiPost('/api/password-strength', { password }),
  generatePassword: (length: number, charset_type: string, count: number) => apiPost('/api/generate-password', { length: String(length), charset_type, count: String(count) }),
  convertHash: (input_str: string, from_format: string, to_format: string) => apiPost('/api/convert-hash', { input_str, from_format, to_format }),
  benchmark: () => apiGet('/api/benchmark'),
  hashcatCommand: (data: Record<string, string>) => apiPost('/api/hashcat-command', data),
  johnCommand: (data: Record<string, string>) => apiPost('/api/john-command', data),
  generateRules: (base_word: string, rule_type: string) => apiPost('/api/generate-rules', { base_word, rule_type }),
  uploadDictionary: (file: File) => apiUpload('/api/upload-dictionary', file),
  getUploads: () => apiGet('/api/uploads'),
  getHistory: (limit?: number) => apiGet(`/api/history?limit=${limit || 50}`),
  health: () => apiGet('/api/health'),
}
