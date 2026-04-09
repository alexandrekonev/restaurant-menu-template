'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './MenuPage.module.css'
// MenuItemCard and MenuItemRow are inlined below — no separate files needed

interface Category {
  _id: string
  title: string
  slug: string
  subtitle?: string
  displayStyle: 'cards' | 'list' | 'compact'
}

interface MenuItem {
  _id: string
  name: string
  description?: string
  price: string
  volume?: string
  badge?: string
  badgeStyle?: string
  subCategory?: string
  allergens?: string[]
  photo?: string
  categorySlug: string
  categoryTitle: string
  order: number
}

interface Settings {
  happyHourActive?: boolean
  happyHourText?: string
  lunchMenuActive?: boolean
  address?: string
  footerNote?: string
}

interface Props {
  categories: Category[]
  items: MenuItem[]
  settings: Settings | null
}

export default function MenuPage({ categories, items, settings }: Props) {
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug || '')
  const navRef = useRef<HTMLDivElement>(null)
  const headerOffset = useRef(0)

  // Group items by category
  const byCategory = (slug: string) => items.filter((i) => i.categorySlug === slug)

  // Group items by sub-category within a category
  const bySubCat = (catItems: MenuItem[]) => {
    const groups: Record<string, MenuItem[]> = {}
    catItems.forEach((item) => {
      const key = item.subCategory || '__none__'
      if (!groups[key]) groups[key] = []
      groups[key].push(item)
    })
    return groups
  }

  // Scroll nav button into view when active changes
  useEffect(() => {
    const btn = navRef.current?.querySelector(`[data-slug="${activeSlug}"]`) as HTMLElement
    btn?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [activeSlug])

  // Intersection observer to highlight nav on scroll
  useEffect(() => {
    const header = document.querySelector('header')
    const nav = navRef.current
    if (!header || !nav) return
    headerOffset.current = header.offsetHeight + nav.offsetHeight + 8

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSlug(e.target.id)
        })
      },
      { rootMargin: `-${headerOffset.current}px 0px -60% 0px`, threshold: 0 }
    )
    document.querySelectorAll('section[id]').forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const scrollToSection = (slug: string) => {
    const target = document.getElementById(slug)
    if (!target) return
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset.current
    window.scrollTo({ top, behavior: 'smooth' })
    setActiveSlug(slug)
  }

  return (
    <>
      {/* ── HEADER ── */}
      <header className={styles.header}>
        <div className={styles.logoWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://www.high-end.bg/images/static/logo-sign-light.svg"
            alt="The High-End Bar"
            className={styles.logoImg}
          />
        </div>
        <div className={styles.headerThe}>The</div>
        <div className={styles.headerName}>High&#8209;End Bar</div>

        {settings?.lunchMenuActive && (
          <Link href="/lunch" className={styles.lunchLink}>
            Today's Lunch →
          </Link>
        )}
      </header>

      {/* ── HAPPY HOUR ── */}
      {settings?.happyHourActive && (
        <div className={styles.happyBanner}>
          <span>Happy Hour</span>
          {settings.happyHourText ? ` · ${settings.happyHourText}` : ''}
        </div>
      )}

      {/* ── CATEGORY NAV ── */}
      <nav className={styles.catNav} ref={navRef}>
        <div className={styles.catNavInner}>
          {categories.map((cat) => (
            <button
              key={cat._id}
              data-slug={cat.slug}
              className={`${styles.catBtn} ${activeSlug === cat.slug ? styles.catBtnActive : ''}`}
              onClick={() => scrollToSection(cat.slug)}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </nav>

      {/* ── MENU SECTIONS ── */}
      <main>
        {categories.map((cat) => {
          const catItems = byCategory(cat.slug)
          if (!catItems.length) return null
          const groups = bySubCat(catItems)

          return (
            <section key={cat._id} id={cat.slug} className={styles.section}>
              {/* Section heading */}
              <div className={styles.sectionHeading}>
                <span className={styles.sectionTitle}>{cat.title}</span>
              </div>
              {cat.subtitle && <p className={styles.sectionDesc}>{cat.subtitle}</p>}

              {/* Items */}
              {cat.displayStyle === 'cards' ? (
                <div className={styles.cardsGrid}>
                  {catItems.map((item) => (
                    <div key={item._id} className={styles.card}>
                      <div className={styles.cardName}>{item.name}</div>
                      {item.description && (
                        <div className={styles.cardDesc}>{item.description}</div>
                      )}
                      <div className={styles.cardFooter}>
                        <span className={styles.cardPrice}>{item.price} €</span>
                        {item.volume && <span className={styles.cardVol}>{item.volume}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : cat.displayStyle === 'compact' ? (
                <div className={styles.compactList}>
                  {Object.entries(groups).map(([sub, subItems]) => (
                    <div key={sub}>
                      {sub !== '__none__' && (
                        <div className={styles.subHeading}>{sub}</div>
                      )}
                      {subItems.map((item) => (
                        <div key={item._id} className={styles.compactItem}>
                          <div className={styles.compactInfo}>
                            <span className={styles.compactName}>{item.name}</span>
                            {item.description && (
                              <span className={styles.compactDesc}>{item.description}</span>
                            )}
                          </div>
                          <div className={styles.compactRight}>
                            <span className={styles.compactPrice}>{item.price} €</span>
                            {item.volume && (
                              <span className={styles.compactVol}>{item.volume}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                // 'list' style
                <div className={styles.listItems}>
                  {Object.entries(groups).map(([sub, subItems]) => (
                    <div key={sub}>
                      {sub !== '__none__' && (
                        <div className={styles.subHeading}>{sub}</div>
                      )}
                      {subItems.map((item) => (
                        <div key={item._id} className={styles.listRow}>
                          <div className={styles.listInfo}>
                            <span className={styles.listName}>{item.name}</span>
                            {item.description && (
                              <span className={styles.listDesc}>{item.description}</span>
                            )}
                          </div>
                          <div className={styles.listRight}>
                            <span className={styles.listPrice}>{item.price} €</span>
                            {item.volume && <span className={styles.listVol}>{item.volume}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </main>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://www.high-end.bg/images/static/logo-sign-light.svg"
          alt=""
          className={styles.footerLogo}
        />
        <div className={styles.footerName}>The High&#8209;End Bar</div>
        <div className={styles.footerAddress}>
          {settings?.address || 'Realtons Place, бул. „Черни връх" 51, София'}
        </div>
        {settings?.footerNote && (
          <div className={styles.footerNote}>{settings.footerNote}</div>
        )}
      </footer>
    </>
  )
}