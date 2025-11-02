import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio Dashboard',
  description: 'Dynamic portfolio dashboard with live metrics',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
