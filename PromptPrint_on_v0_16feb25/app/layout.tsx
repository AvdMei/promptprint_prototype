import type { Metadata } from "next"
import type React from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "AI PromptPrint -- Energy Usage Comparison",
  description: "Compare energy demand between different AI models",
  icons: {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon.ico-ZC5qDTIZwZtMNwZytVnsNBcViIZ21F.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8f9fa]">{children}</body>
    </html>
  )
}



import './globals.css'