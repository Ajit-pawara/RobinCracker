import type { Metadata } from 'next'
import './globals.css'
import { Inter, JetBrains_Mono } from 'next/font/google'
import ClientLayout from './ClientLayout'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'RobinCracker — Professional Password Hash Analysis Toolkit',
  description: 'Professional-grade password hash analysis, identification, cracking command builder, and security auditing toolkit.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans bg-cyber-bg text-cyber-text antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
