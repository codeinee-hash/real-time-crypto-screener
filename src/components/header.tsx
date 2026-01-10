'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ROUTES } from '@/utils/routes.const'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/css'

export function Header() {
  const pathname = usePathname()

  return (
    <header>
      <div className="main-container inner">
        <Link href={ROUTES.HOME}>
          <Image src="/logo.svg" alt="Crypto logo" width={132} height={40} />
        </Link>

        <nav>
          <Link
            href={ROUTES.HOME}
            className={cn('nav-link', {
              'is-active': pathname === ROUTES.HOME,
              'is-home': true,
            })}
          >
            Home
          </Link>
          <p>Search Modal</p>
          <Link
            href={ROUTES.COINS}
            className={cn('nav-link', {
              'is-active': pathname === ROUTES.COINS,
            })}
          >
            All Coins
          </Link>
        </nav>
      </div>
    </header>
  )
}
