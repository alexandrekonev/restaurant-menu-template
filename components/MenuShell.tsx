'use client'

import { useState, useEffect, useRef } from 'react'
import { Locale, t, ui_t, isWithinTimeWindow } from '@/lib/i18n'
import ItemCard from './ItemCard'
import ItemRow from './ItemRow'
import DailyMenuSection from './DailyMenuSection'
import ReservationModal from './ReservationModal'
import styles from './MenuShell.module.css'

// When no logo is uploaded in Sanity, these plain SVG placeholders are used.
const FALLBACK_EMBLEM = '/placeholder-emblem.svg'
const FALLBACK_LOGO   = '/placeholder-logo.svg'
const FALLBACK_COLOR  = '#8B6914'
const FALLBACK_NAME   = 'Restaurant'

// SVG icons for social links
const IconInstagram = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)
const IconFacebook = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)
const IconTikTok = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
)
const IconGoogle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 11.5v3h5.5c-.22 1.27-1.7 3.71-5.5 3.71-3.31 0-6-2.74-6-6.21s2.69-6.21 6-6.21c1.88 0 3.14.8 3.86 1.49l2.63-2.53C16.8 3.2 14.6 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10c5.77 0 9.6-4.06 9.6-9.78 0-.65-.07-1.15-.18-1.65H12z"/>
  </svg>
)
const IconGoogleReview = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 11.5v3h5.5c-.22 1.27-1.7 3.71-5.5 3.71-3.31 0-6-2.74-6-6.21s2.69-6.21 6-6.21c1.88 0 3.14.8 3.86 1.49l2.63-2.53C16.8 3.2 14.6 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10c5.77 0 9.6-4.06 9.6-9.78 0-.65-.07-1.15-.18-1.65H12z"/>
  </svg>
)
const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </svg>
)
const IconChevronUp = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
)

const DAY_LABELS: Record<string, { bg: string; en: string }> = {
  monday:    { bg: 'Пон', en: 'Mon' },
  tuesday:   { bg: 'Вт',  en: 'Tue' },
  wednesday: { bg: 'Ср',  en: 'Wed' },
  thursday:  { bg: 'Чет', en: 'Thu' },
  friday:    { bg: 'Пет', en: 'Fri' },
  saturday:  { bg: 'Съб', en: 'Sat' },
  sunday:    { bg: 'Нед', en: 'Sun' },
}

export interface MenuItemData {
  _id: string
  name: { bg?: string | null; en?: string | null }
  description?: { bg?: string | null; en?: string | null } | null
  price: string
  volume?: string | null
  tags?: string[] | null
  customTags?: string[] | null
  isFeatured?: boolean | null
  isNew?: boolean | null
  allergens?: string[] | null
  subCategory?: string | null
  _createdAt: string
  image?: string | null
  categorySlug: string
}

export interface CategoryData {
  _id: string
  name: { bg?: string | null; en?: string | null }
  slug: string
  icon?: string | null
  displayStyle: 'cards' | 'list' | 'compact'
  isFeatured?: boolean | null
}

interface MenuShellProps {
  categories: CategoryData[]
  items: MenuItemData[]
  settings: any
  dailyMenu: any
  locale: Locale
}

export default function MenuShell({
  categories,
  items,
  settings,
  dailyMenu,
  locale,
}: MenuShellProps) {
  const [activeSlug, setActiveSlug] = useState<string>(
    categories.length > 0 ? categories[0].slug : ''
  )
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [reservationOpen, setReservationOpen] = useState(false)

  const navRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const isScrollingRef = useRef(false)
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intersectingRef = useRef<Set<string>>(new Set())

  // ── Derived settings with fallbacks ──────────────────────────────────────
  const venueName   = settings?.venueName     || FALLBACK_NAME
  const emblemUrl   = settings?.logoEmblemUrl || FALLBACK_EMBLEM
  const logoFullUrl = settings?.logoFullUrl   || FALLBACK_LOGO
  const accentColor = settings?.accentColor   || FALLBACK_COLOR

  // ── Happy Hour ────────────────────────────────────────────────────────────
  const happyHourActive =
    settings?.happyHourActive && (
      !settings?.happyHourFrom || !settings?.happyHourUntil ||
      isWithinTimeWindow(settings.happyHourFrom, settings.happyHourUntil)
    )

  // ── Lunch Menu ────────────────────────────────────────────────────────────
  const lunchMenuActive =
    settings?.lunchMenuActive &&
    dailyMenu && (
      !dailyMenu?.validFrom || !dailyMenu?.validUntil ||
      isWithinTimeWindow(dailyMenu.validFrom, dailyMenu.validUntil)
    )

  const lunchTitle =
    t(dailyMenu?.title, locale) ||
    t(settings?.lunchMenuTitle, locale) ||
    (locale === 'bg' ? 'Обедно меню' : 'Lunch Menu')

  // ── Group items by category slug ──────────────────────────────────────────
  const itemsByCategory: { [key: string]: MenuItemData[] } = {}
  items.forEach((item) => {
    if (!itemsByCategory[item.categorySlug]) {
      itemsByCategory[item.categorySlug] = []
    }
    itemsByCategory[item.categorySlug].push(item)
  })

  const itemsBySubCategory = (categorySlug: string) => {
    const categoryItems = itemsByCategory[categorySlug] || []
    const grouped: { [key: string]: MenuItemData[] } = {}
    categoryItems.forEach((item) => {
      const subCat = item.subCategory || '__none__'
      if (!grouped[subCat]) grouped[subCat] = []
      grouped[subCat].push(item)
    })
    return grouped
  }

  // ── Centre nav button whenever active slug changes (click OR scroll) ─────
  // We scroll the nav strip manually instead of using scrollIntoView, because
  // scrollIntoView(block:'nearest') can also scroll the window vertically in
  // Firefox (even on a sticky element), which corrupts the click-scroll lock.
  useEffect(() => {
    const nav = navRef.current
    const btn = document.getElementById(`nav-${activeSlug}`) as HTMLElement | null
    if (!nav || !btn) return
    const target = btn.offsetLeft - nav.offsetWidth / 2 + btn.offsetWidth / 2
    nav.scrollTo({ left: Math.max(0, target), behavior: 'smooth' })
  }, [activeSlug])

  // ── Click: lock observer, scroll section into view ───────────────────────
  // Lock is released by the scroll-end detector below (not a fixed timeout)
  const scrollToSection = (slug: string) => {
    isScrollingRef.current = true
    setActiveSlug(slug)
    setTimeout(() => {
      const el = document.getElementById(`section-${slug}`)
      if (!el) return
      const navHeight = navRef.current?.offsetHeight || 50
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 8
      window.scrollTo({ top, behavior: 'smooth' })
    }, 10)
  }

  // ── IntersectionObserver: track ALL visible sections in a Set ─────────────
  // The observer only delivers *changed* entries per callback, so we maintain
  // a persistent Set and always pick the first category (menu order = top-down)
  // that is currently inside the detection band.
  useEffect(() => {
    if (categories.length === 0) return
    const intersecting = intersectingRef.current

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const slug = entry.target.getAttribute('data-slug')
          if (!slug) return
          if (entry.isIntersecting) {
            intersecting.add(slug)
          } else {
            intersecting.delete(slug)
          }
        })
        // Don't fight the programmatic scroll animation
        if (isScrollingRef.current) return
        if (intersecting.size === 0) return
        // First category in menu order that is currently visible = topmost on screen
        const active = categories.find((cat) => intersecting.has(cat.slug))
        if (active) setActiveSlug(active.slug)
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    )

    categories.forEach((cat) => {
      const el = document.getElementById(`section-${cat.slug}`)
      if (el) observerRef.current?.observe(el)
    })

    return () => {
      observerRef.current?.disconnect()
      intersecting.clear()
    }
  }, [categories])

  // ── Scroll: back-to-top visibility + release click-scroll lock ───────────
  // Releases isScrollingRef 150 ms after the last scroll event so the
  // IntersectionObserver can resume tracking after a click-triggered scroll.
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      setShowBackToTop(scrolled > 0.1)
      if (isScrollingRef.current) {
        if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current)
        scrollEndTimerRef.current = setTimeout(() => {
          isScrollingRef.current = false
        }, 150)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current)
    }
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const workingHours: any[] = settings?.workingHours || []
  const googleWriteReviewUrl = settings?.googleWriteReviewUrl || null
  const socialLinks = [
    { url: settings?.instagramUrl,    icon: <IconInstagram />, label: 'Instagram' },
    { url: settings?.facebookUrl,     icon: <IconFacebook />,  label: 'Facebook' },
    { url: settings?.tiktokUrl,       icon: <IconTikTok />,    label: 'TikTok' },
    { url: settings?.googleReviewUrl, icon: <IconGoogle />, label: 'Google Review' },
  ].filter(s => !!s.url)

  return (
    <div
      className={styles.container}
      style={{ '--copper': accentColor } as React.CSSProperties}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.hero}>
          <img src={emblemUrl} alt="" className={styles.heroEmblem} />
          <img src={logoFullUrl} alt={venueName} className={styles.heroLogo} />
          <div className={styles.langToggle}>
            <a href="/menu" className={`${styles.langBtn} ${locale === 'bg' ? styles.langActive : ''}`}>БГ</a>
            <span className={styles.langSep}>|</span>
            <a href="/menu/en" className={`${styles.langBtn} ${locale === 'en' ? styles.langActive : ''}`}>EN</a>
          </div>

          {(socialLinks.length > 0 || googleWriteReviewUrl) && (
            <div className={styles.headerSocial}>
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={styles.headerSocialLink}
                  title={s.label}
                >
                  {s.icon}
                </a>
              ))}
              {googleWriteReviewUrl && (
                <a
                  href={googleWriteReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Write a Google Review"
                  className={styles.googleReviewBtn}
                  title="Write a Google Review"
                >
                  <IconGoogleReview />
                  <span>Review</span>
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ── Happy Hour ─────────────────────────────────────────────────────── */}
      {happyHourActive && (
        <div className={styles.happyHourOverlay}>
          <div className={styles.happyHourInner}>
            <span className={styles.happyHourLabel}>Happy Hour</span>
            <div className={styles.happyHourRule} />
            <span className={styles.happyHourText}>
              {t(settings?.happyHourText, locale) || ui_t('happyHour', locale)}
            </span>
          </div>
        </div>
      )}

      {/* ── Category Navigation ───────────────────────────────────────────── */}
      <nav className={styles.categoryNav} ref={navRef}>
        <div className={styles.categoryScroller}>
          {categories.map((cat) => (
            <button
              key={cat._id}
              id={`nav-${cat.slug}`}
              onClick={() => scrollToSection(cat.slug)}
              className={[
                styles.categoryButton,
                activeSlug === cat.slug ? styles.active : '',
                cat.isFeatured ? styles.featuredBtn : '',
              ].filter(Boolean).join(' ')}
            >
              {cat.icon && <span>{cat.icon}</span>}
              <span>{t(cat.name, locale)}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main className={styles.main}>
        {lunchMenuActive && (
          <section className={styles.lunchSection}>
            <h2 className={styles.lunchSectionTitle}>{lunchTitle}</h2>
            <div className={styles.divider} />
            <DailyMenuSection
              menu={dailyMenu as any}
              locale={locale}
              hideTitle
              showPriceEur={settings?.showPriceEur !== false}
              showPriceBgn={settings?.showPriceBgn !== false}
            />
          </section>
        )}

        {categories.map((cat) => {
          const catItems = itemsByCategory[cat.slug] || []
          const subGroups = itemsBySubCategory(cat.slug)

          return (
            <section
              key={cat._id}
              id={`section-${cat.slug}`}
              data-slug={cat.slug}
              className={styles.section}
            >
              <h2 className={`${styles.sectionTitle}${cat.isFeatured ? ` ${styles.featuredTitle}` : ''}`}>
                {cat.isFeatured && <span className={styles.featuredMark} aria-hidden="true">◆</span>}
                {cat.icon && <span className={styles.sectionIcon}>{cat.icon}</span>}
                {t(cat.name, locale)}
              </h2>
              <div className={styles.divider} />

              {catItems.length === 0 ? (
                <p className={styles.empty}>—</p>
              ) : cat.displayStyle === 'cards' ? (
                <div className={styles.cardsGrid}>
                  {catItems.map((item) => (
                    <ItemCard
                      key={item._id}
                      item={item}
                      locale={locale}
                      showPriceBgn={settings?.showPriceBgn !== false}
                      showPriceEur={settings?.showPriceEur !== false}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.listContainer}>
                  {Object.entries(subGroups).map(([subCat, subItems]) => (
                    <div key={subCat} className={styles.subCategoryGroup}>
                      {subCat !== '__none__' && (
                        <h3 className={styles.subCategoryTitle}>{subCat}</h3>
                      )}
                      <div className={styles.itemsList}>
                        {subItems.map((item) => (
                          <ItemRow
                            key={item._id}
                            item={item}
                            locale={locale}
                            compact={cat.displayStyle === 'compact'}
                            showPriceBgn={settings?.showPriceBgn !== false}
                            showPriceEur={settings?.showPriceEur !== false}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <img src={emblemUrl} alt={venueName} className={styles.footerLogo} />

          <div className={styles.footerInfo}>
            {settings?.address && <p className={styles.address}>{settings.address}</p>}

            {/* Working Hours */}
            {workingHours.length > 0 && (
              <div className={styles.workingHours}>
                {workingHours.map((entry: any, i: number) => (
                  <div key={i} className={styles.hoursRow}>
                    <span className={styles.hoursDay}>
                      {DAY_LABELS[entry.day]?.[locale] || entry.day}
                    </span>
                    <span className={styles.hoursTime}>{entry.hours}</span>
                    {entry.concept && (
                      <span className={styles.hoursConcept}>{entry.concept}</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {settings?.footerNote && (
              <p className={styles.note}>{t(settings.footerNote, locale)}</p>
            )}

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className={styles.socialLinks}>
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={styles.socialLink}
                    title={s.label}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}

            <p className={styles.copyright}>
              © {new Date().getFullYear()} {venueName}. {ui_t('copyright', locale)}.
            </p>
          </div>
        </div>
      </footer>

      {/* ── Floating: Back-to-Top ─────────────────────────────────────────── */}
      <button
        className={`${styles.fabTop} ${showBackToTop ? styles.fabVisible : ''}`}
        onClick={scrollToTop}
        aria-label={locale === 'bg' ? 'Към началото' : 'Back to top'}
        title={locale === 'bg' ? 'Към началото' : 'Back to top'}
      >
        <IconChevronUp />
      </button>

      {/* ── Floating: Reservation + Call ─────────────────────────────────── */}
      <div className={styles.fabGroup}>
        {settings?.reservationEmail && (
          <button
            className={styles.fabReservation}
            onClick={() => setReservationOpen(true)}
            aria-label={locale === 'bg' ? 'Резервация' : 'Reservation'}
          >
            {locale === 'bg' ? 'Резервация' : 'Reservation'}
          </button>
        )}
        {settings?.phone && (
          <a
            href={`tel:${settings.phone}`}
            className={styles.fabCall}
            aria-label={locale === 'bg' ? 'Обади се' : 'Call us'}
            title={locale === 'bg' ? 'Обади се' : 'Call us'}
          >
            <IconPhone />
          </a>
        )}
      </div>

      {/* ── Reservation Modal ─────────────────────────────────────────────── */}
      {reservationOpen && (
        <ReservationModal
          locale={locale}
          venueName={venueName}
          onClose={() => setReservationOpen(false)}
        />
      )}
    </div>
  )
}