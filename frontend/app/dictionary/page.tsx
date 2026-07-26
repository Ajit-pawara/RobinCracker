'use client'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { Upload, FileText, Search, Trash2, Database, Download, List, Hash } from 'lucide-react'

export default function Dictionary() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [uploads, setUploads] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const loadUploads = async () => {
    try {
      const data = await api.getUploads()
      setUploads(data.uploads || [])
    } catch {}
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const res = await api.uploadDictionary(file)
      setResult(res)
      loadUploads()
    } catch (e: any) {
      setError(e.message || 'Upload failed')
    }
    setUploading(false)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024*1024) return (bytes/1024).toFixed(1)+' KB'
    return (bytes/(1024*1024)).toFixed(1)+' MB'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono font-bold text-2xl">Dictionary Manager</h1>
        <p className="text-cyber-muted text-sm mt-1">Upload, browse and analyze custom wordlists</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div
            className="border-2 border-dashed border-cyber-edge rounded-xl p-8 text-center cursor-pointer hover:border-cyber-cyan/50 transition-colors"
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault()
              if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0])
            }}
          >
            <input ref={fileRef} type="file" accept=".txt,.lst,.dict,.csv" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
            <Upload className="w-10 h-10 text-cyber-muted mx-auto mb-3" />
            <p className="font-mono text-sm mb-1">{file ? file.name : 'Drop a wordlist file here or click to browse'}</p>
            <p className="text-xs text-cyber-muted">.txt, .lst, .dict — no copyrighted wordlists bundled</p>
            {file && (
              <div className="mt-3">
                <Badge variant="info">{formatSize(file.size)}</Badge>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <Button variant="primary" onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? 'Uploading...' : 'Upload & Analyze'}
              <Upload className="w-4 h-4" />
            </Button>
          </div>

          {error && <div className="p-3 rounded-lg bg-cyber-red/10 border border-cyber-red/30 text-cyber-red text-sm font-mono">{error}</div>}

          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-lg bg-cyber-green/5 border border-cyber-green/20">
              <h4 className="font-mono font-bold text-sm text-cyber-green mb-3">Upload Complete</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-2 rounded bg-cyber-bg/50">
                  <div className="text-xs text-cyber-muted">Filename</div>
                  <div className="font-mono text-sm truncate">{result.filename}</div>
                </div>
                <div className="p-2 rounded bg-cyber-bg/50">
                  <div className="text-xs text-cyber-muted">Size</div>
                  <div className="font-mono text-sm">{formatSize(result.size)}</div>
                </div>
                <div className="p-2 rounded bg-cyber-bg/50">
                  <div className="text-xs text-cyber-muted">Entries</div>
                  <div className="font-mono text-sm">{result.entries?.toLocaleString()}</div>
                </div>
                <div className="p-2 rounded bg-cyber-bg/50">
                  <div className="text-xs text-cyber-muted">Duplicates</div>
                  <div className="font-mono text-sm">{result.duplicates?.toLocaleString()}</div>
                </div>
              </div>
              {result.preview && (
                <div className="mt-4">
                  <div className="text-xs text-cyber-muted mb-2">Preview (first 20 lines)</div>
                  <div className="terminal-window">
                    <div className="terminal-body text-xs max-h-32 overflow-y-auto">
                      {result.preview.map((line: string, i: number) => (
                        <div key={i} className="text-cyber-text">{line || ' '}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Previously uploaded */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Database className="w-4 h-4" /> Previously Uploaded</CardTitle>
        </CardHeader>
        <CardContent>
          {uploads.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-10 h-10 text-cyber-muted/30 mx-auto mb-2" />
              <p className="font-mono text-sm text-cyber-muted">No uploads yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {uploads.map((u: any) => (
                <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-cyber-panel/50 border border-cyber-edge">
                  <div className="flex items-center gap-3">
                    <List className="w-4 h-4 text-cyber-cyan" />
                    <span className="font-mono text-sm">{u.filename}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-cyber-muted">{u.entries} entries</span>
                    <span className="font-mono text-xs text-cyber-muted">{formatSize(u.size)}</span>
                    <Badge variant="info">{u.encoding || 'utf-8'}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
