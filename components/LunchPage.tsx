import Link from 'next/link'
import DailyMenuSection from './DailyMenuSection'
import type { Locale } from '@/lib/i18n'

interface Dish {
  name: { bg?: string | null; en?: string | null }
  description?: { bg?: string | null; en?: string | null }
  price?: string
  tags?: string[]
  image?: string
}

interface Section {
  heading: { bg?: string | null; en?: string | null }
  dishes: Dish[]
}

interface LunchMenu {
  _id: string
  date: string
  validFrom: string
  validUntil: string
  chefNote?: { bg?: string | null; en?: string | null }
  sections: Section[]
}

interface Settings {
  address?: string
  footerNote?: { bg?: string | null; en?: string | null }
}

interface Props {
  lunchMenu: LunchMenu | null
  settings: Settings | null
  locale?: Locale
}

export default function LunchPage({ lunchMenu, settings, locale = 'bg' }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)' }}>
      {/* Back link */}
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <Link
          href={locale === 'en' ? '/menu/en' : '/menu'}
          style={{
            fontFamily: 'var(--font-sc)',
            fontSize: '10px',
            letterSpacing: '.2em',
            color: 'var(--warm-gray)',
            textTransform: 'uppercase',
          }}
        >
          ← Меню
        </Link>
      </div>

      {/* Daily menu section */}
      {lunchMenu ? (
        <DailyMenuSection menu={lunchMenu as any} locale={locale} />
      ) : (
        <p
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            color: 'var(--warm-gray)',
          }}
        >
          {locale === 'en'
            ? 'No lunch menu for today.'
            : 'Няма обедно меню за днес.'}
        </p>
      )}

      {/* Footer */}
      <footer
        style={{
          background: 'var(--copper)',
          textAlign: 'center',
          padding: '24px 20px',
          marginTop: '40px',
          fontFamily: 'var(--font-sc)',
          fontSize: '12px',
          letterSpacing: '.15em',
          color: 'rgba(255,255,255,.8)',
        }}
      >
        {settings?.address && (
          <div style={{ fontSize: '11px', opacity: .7, marginTop: '4px' }}>
            {settings.address}
          </div>
        )}
      </footer>
    </div>
  )
}
