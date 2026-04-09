import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { settingsQuery } from '@/sanity/lib/queries'
import './globals.css'

// Revalidate layout metadata every 60 s (ISR)
export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch<any>(settingsQuery)
  const venueName = settings?.venueName || 'Restaurant'
  const logoUrl   = settings?.logoEmblemUrl as string | undefined

  return {
    title: `${venueName} — Digital Menu`,
    description: `Discover the menu of ${venueName}`,
    viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
    ...(logoUrl && {
      icons: {
        icon: logoUrl,
        shortcut: logoUrl,
        apple: logoUrl,
      },
    }),
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bg">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Cormorant+SC:wght@400;600;700&family=Open+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
