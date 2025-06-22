// /app/layout.js
import './globals.css'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export const metadata = {
  title: 'PT Kwalram – Textile & Manufacturing Solutions',
  description: 'Sistem manajemen modern untuk bisnis tekstil dan manufaktur PT Kwalram',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-gradient-to-br from-gray-50 via-blue-50 to-white min-h-screen text-blue-900">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen container mx-auto px-2 md:px-6 py-4 md:py-8">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}