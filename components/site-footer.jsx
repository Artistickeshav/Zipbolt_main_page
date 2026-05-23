import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 text-sm sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          <div>
            <h3 className="mb-4 text-base font-semibold text-gray-900">Pages</h3>
            <ul className="space-y-2 text-gray-600">
              <li><Link href="/services" className="transition-colors hover:text-gray-900">Services</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-gray-900">About us</Link></li>
              <li><Link href="/#portfolio" className="transition-colors hover:text-gray-900">Portfolio</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-gray-900">Contact us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-base font-semibold text-gray-900">Social Media</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link
                  href="https://www.facebook.com/share/1BdtdNCaf2/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gray-900"
                >
                  Facebook
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.linkedin.com/company/zipbolt/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gray-900"
                >
                  LinkedIn
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-base font-semibold text-gray-900">Legal</h3>
            <ul className="space-y-2 text-gray-600">
              <li><Link href="/privacy" className="transition-colors hover:text-gray-900">Privacy and Cookies Policy</Link></li>
              <li><Link href="/terms" className="transition-colors hover:text-gray-900">Terms &amp; Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
          <p>&copy; 2026 Zipbolt Innovations Private Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
