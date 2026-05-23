'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/about', label: 'About us' },
  { href: '/services', label: 'Services' },
  { href: '/#portfolio', label: 'Portfolio' },
]

function getNavClasses(variant, active) {
  if (variant === 'dark') {
    return active
      ? 'text-white'
      : 'text-gray-200 transition-colors hover:text-white'
  }

  return active
    ? 'text-gray-900'
    : 'text-gray-700 transition-colors hover:text-blue-500'
}

export function SiteHeader({ variant = 'light', fixed = false }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!fixed) {
      return undefined
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [fixed])

  const isDark = variant === 'dark'
  const shellClasses = fixed
    ? `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`
    : isDark
      ? 'bg-[#1f2428] text-white'
      : 'bg-white'

  return (
    <header className={shellClasses}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-4 py-4 lg:min-h-20">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logos/logo_3.png"
              alt="ZIPBOLT"
              width={140}
              height={40}
              className="h-8 w-auto lg:h-10"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href.startsWith('/#') && pathname === '/')
              return (
                <Link key={link.href} href={link.href} className={getNavClasses(variant, active)}>
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden md:block">
            <Link href="/contact">
              <Button
                className={
                  isDark
                    ? 'rounded-full bg-white px-6 text-gray-900 hover:bg-gray-100'
                    : 'rounded-full bg-gradient-to-r from-gray-700 to-gray-900 px-6 text-white hover:from-gray-800 hover:to-black'
                }
              >
                Contact us
              </Button>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            className={`md:hidden rounded-lg p-2 transition-colors ${
              isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className={`md:hidden border-t py-4 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const active = pathname === link.href || (link.href.startsWith('/#') && pathname === '/')
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-xl px-4 py-3 text-sm font-medium ${getNavClasses(variant, active)} ${
                      isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <Link href="/contact" className="px-4 pt-2">
                <Button
                  className={
                    isDark
                      ? 'w-full rounded-full bg-white text-gray-900 hover:bg-gray-100'
                      : 'w-full rounded-full bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-800 hover:to-black'
                  }
                >
                  Contact us
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
