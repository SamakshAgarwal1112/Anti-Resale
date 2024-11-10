'use client'
import { useState, useEffect } from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '../components/Header'


const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [totalEarning, setTotalEarning] = useState(0)

  useEffect(() => {
    // Placeholder for future logic
  }, [])

  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='min-h-screen bg-gray-50 flex-col'>
          {/* Header */}
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} totalEarnings={totalEarning} />
          <div className='flex flex-1'>
            {/* Sidebar */}
            
            <main className='flex-1 p-4 lg:p-8 lg:ml-64 transition-all duration-300'>
              {children}
            </main>
          </div>
        </div>
        
      </body>
    </html>
  )
}
