import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fathom AI - Meeting Intelligence',
  description: 'AI-powered meeting transcription, summaries, and insights',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
