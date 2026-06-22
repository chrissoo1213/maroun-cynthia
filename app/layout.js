import './globals.css'
import { Cormorant_Garamond, Great_Vibes, Inter, Dancing_Script } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
})

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-script',
})

const dancing = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hand',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600'],
  variable: '--font-sans',
})

export const metadata = {
  title: 'Maroun & Cynthia — A Wedding Story',
  description: 'Maroun & Cynthia invite you to celebrate their wedding on July 23, 2026.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${greatVibes.variable} ${dancing.variable} ${inter.variable}`}>
      <body className="font-serif bg-black text-white overflow-hidden">
        {children}
      </body>
    </html>
  )
}
