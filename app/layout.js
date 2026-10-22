import './globals.css'
import { NAME, LINKS } from './data/profile'

const SITE_URL = 'https://vishwaswarup.vercel.app'
const TITLE = `${NAME} | Machine Learning Engineer`
const DESCRIPTION =
  'Vishwaswarup Rath is a Machine Learning Engineer and B.Tech AI/ML student building practical, intelligent software across AI, machine learning and full-stack development. View projects and get in touch.'
const SHORT_DESCRIPTION =
  'Machine Learning Engineer and AI/ML student building practical, intelligent software across AI, machine learning and full-stack development.'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    'Vishwaswarup Rath, Machine Learning Engineer, AI/ML Developer, Full Stack Developer, RAG, LangChain, TensorFlow, Portfolio',
  authors: [{ name: NAME }],
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.png', apple: '/apple-touch-icon.png' },
  openGraph: {
    type: 'website',
    title: TITLE,
    description: SHORT_DESCRIPTION,
    url: SITE_URL,
    images: ['/apple-touch-icon.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: SHORT_DESCRIPTION,
    images: ['/apple-touch-icon.png'],
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: NAME,
  jobTitle: 'Machine Learning Engineer',
  url: `${SITE_URL}/`,
  sameAs: [LINKS.github, LINKS.linkedin, LINKS.leetcode],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  )
}
