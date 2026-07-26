'use client'
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Download, FileJson, FileText, FileCog, FileSpreadsheet, CheckCircle } from 'lucide-react'

const sampleData = {
  analysis: [
    { hash: '5f4dcc3b5aa765d61d8327deb882cf99', algorithm: 'MD5', confidence: 95, date: '2026-07-26' },
    { hash: '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8', algorithm: 'SHA-1', confidence: 95, date: '2026-07-26' },
  ],
  meta: { tool: 'RobinCracker', version: '1.0.0', exported: new Date().toISOString() }
}

export default function Export() {
  const [format, setFormat] = useState<'json' | 'csv' | 'markdown'>('json')
  const [exported, setExported] = useState(false)

  const generateExport = () => {
    let content = ''
    const filename = `robin-export-${Date.now()}`
    
    switch (format) {
      case 'json':
        content = JSON.stringify(sampleData, null, 2)
        download(content, `${filename}.json`, 'application/json')
        break
      case 'csv':
        content = 'hash,algorithm,confidence,date\n'
        sampleData.analysis.forEach((a: any) => {
          content += `${a.hash},${a.algorithm},${a.confidence},${a.date}\n`
        })
        download(content, `${filename}.csv`, 'text/csv')
        break
      case 'markdown':
        content = '# RobinCracker Export\n\n## Hash Analysis Results\n\n'
        content += '| Hash | Algorithm | Confidence | Date |\n'
        content += '|------|-----------|------------|------|\n'
        sampleData.analysis.forEach((a: any) => {
          content += `| \`${a.hash}\` | ${a.algorithm} | ${a.confidence}% | ${a.date} |\n`
        })
        content += `\n*Exported by RobinCracker v1.0.0 on ${new Date().toISOString()}*\n`
        download(content, `${filename}.md`, 'text/markdown')
        break
    }
    setExported(true)
    setTimeout(() => setExported(false), 3000)
  }

  const download = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono font-bold text-2xl">Export</h1>
        <p className="text-cyber-muted text-sm mt-1">Export your analysis results in multiple formats</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <Tabs defaultTab="json">
            <TabsList>
              <TabsTrigger value="json"><FileJson className="w-4 h-4" /> JSON</TabsTrigger>
              <TabsTrigger value="csv"><FileSpreadsheet className="w-4 h-4" /> CSV</TabsTrigger>
              <TabsTrigger value="markdown"><FileText className="w-4 h-4" /> Markdown</TabsTrigger>
            </TabsList>

            <TabsContent value="json">
              <div className="p-4 rounded-lg bg-cyber-panel/50 border border-cyber-edge">
                <p className="text-sm text-cyber-muted mb-2">Export as structured JSON — ideal for programmatic use or API integration.</p>
                <div className="terminal-window">
                  <div className="terminal-body text-xs max-h-40 overflow-y-auto">
                    <pre className="text-cyber-text">{JSON.stringify(sampleData, null, 2).slice(0, 500)}</pre>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="csv">
              <div className="p-4 rounded-lg bg-cyber-panel/50 border border-cyber-edge">
                <p className="text-sm text-cyber-muted mb-2">Export as CSV — open in Excel, Google Sheets, or any spreadsheet tool.</p>
                <div className="terminal-window">
                  <div className="terminal-body text-xs">
                    <pre className="text-cyber-text">hash,algorithm,confidence,date{'\n'}5f4dcc...,MD5,95,2026-07-26</pre>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="markdown">
              <div className="p-4 rounded-lg bg-cyber-panel/50 border border-cyber-edge">
                <p className="text-sm text-cyber-muted mb-2">Export as Markdown — perfect for GitHub, documentation, or reports.</p>
                <div className="terminal-window">
                  <div className="terminal-body text-xs">
                    <pre className="text-cyber-text">| Hash | Algorithm | Confidence | Date |{'\n'}|------|-----------|------------|------|{'\n'}| 5f4dcc... | MD5 | 95% | ... |</pre>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3">
            {['json', 'csv', 'markdown'].map(f => (
              <button
                key={f}
                onClick={() => setFormat(f as any)}
                className={`flex-1 p-3 rounded-lg border font-mono text-sm transition-all ${
                  format === f ? 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green' : 'bg-cyber-panel border-cyber-edge text-cyber-muted hover:text-cyber-text'
                }`}
              >
                {f === 'json' ? '.json' : f === 'csv' ? '.csv' : '.md'}
              </button>
            ))}
          </div>

          <Button variant="primary" onClick={generateExport} className="w-full">
            {exported ? <CheckCircle className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            {exported ? 'Downloaded!' : 'Download Export'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-cyber-muted">
            <strong className="text-cyber-amber">Note:</strong> This exports sample data. Future versions will export your actual analysis history.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
