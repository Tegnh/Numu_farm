import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'نمو | منصة الحلول الزراعية المتكاملة',
    description: 'منصة شاملة لتأجير المعدات الزراعية وإدارة المزارع الذكية - نمو معك لمستقبل زراعي أفضل',
    keywords: 'تأجير معدات زراعية, إدارة مزارع, حلول زراعية, السعودية, الخليج',
    authors: [{ name: 'Numu Platform' }],
    openGraph: {
        title: 'نمو | منصة الحلول الزراعية المتكاملة',
        description: 'منصة شاملة لتأجير المعدات الزراعية وإدارة المزارع الذكية',
        type: 'website',
        locale: 'ar_SA',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ar" dir="rtl">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className="antialiased">
                {children}
            </body>
        </html>
    )
}
