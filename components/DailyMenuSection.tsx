import { PortableText, PortableTextComponents } from '@portabletext/react'
import { Locale, t, ui_t, isWithinTimeWindow } from '@/lib/i18n'
import styles from './DailyMenuSection.module.css'

const EUR_TO_BGN = 1.95583

const SECTION_TYPE_LABELS: Record<string, { bg: string; en: string }> = {
  soups:     { bg: 'Супи',           en: 'Soups' },
  starters:  { bg: 'Предястия',      en: 'Starters' },
  mains:     { bg: 'Основни ястия',  en: 'Main Dishes' },
  salads:    { bg: 'Салати',         en: 'Salads' },
  desserts:  { bg: 'Десерти',        en: 'Desserts' },
  surprises: { bg: 'Изненади',       en: 'Surprises' },
}

function parseDishPrice(price: number | string | null | undefined): number | null {
  if (price == null || price === '') return null
  const num = typeof price === 'number' ? price : parseFloat(String(price).replace(',', '.'))
  return isNaN(num) ? null : num
}

// Portable Text components — each paragraph on its own line
const chefDescComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className={styles.chefDescPara}>{children}</p>,
  },
  list: {
    bullet:   ({ children }) => <ul className={styles.chefDescList}>{children}</ul>,
    number:   ({ children }) => <ol className={styles.chefDescList}>{children}</ol>,
  },
  listItem: {
    bullet:   ({ children }) => <li>{children}</li>,
    number:   ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em:     ({ children }) => <em>{children}</em>,
  },
}

interface DailyMenuSectionProps {
  menu: any
  locale: Locale
  hideTitle?: boolean
  showPriceEur?: boolean
  showPriceBgn?: boolean
}

export default function DailyMenuSection({
  menu,
  locale,
  hideTitle = false,
  showPriceEur = true,
  showPriceBgn = true,
}: DailyMenuSectionProps) {
  if (!menu) return null

  const hasContent =
    menu.chefNote?.bg || menu.chefNote?.en ||
    menu.sections?.some((s: any) => s.dishes?.length > 0)

  if (!hasContent) return null

  const isActive = isWithinTimeWindow(
    menu.validFrom || '12:00',
    menu.validUntil || '15:00'
  )

  return (
    <section className={styles.section}>
      {!hideTitle && (
        <div className={styles.header}>
          <h2 className={styles.title}>{ui_t('lunchMenu', locale)}</h2>
        </div>
      )}

      {menu.chefNote && (
        <div className={styles.chefDesc}>
          <p className={styles.chefDescLabel}>{ui_t('chefNote', locale)}</p>
          <div className={styles.chefDescBody}>
            {Array.isArray(menu.chefNote?.[locale] ?? menu.chefNote?.bg) ? (
              <PortableText
                value={menu.chefNote[locale] ?? menu.chefNote.bg}
                components={chefDescComponents}
              />
            ) : (
              <p className={styles.chefDescPara}>{t(menu.chefNote, locale)}</p>
            )}
          </div>
        </div>
      )}

      {!isActive && (
        <div className={styles.notActive}>
          {ui_t('notActiveYet', locale)}
        </div>
      )}

      {isActive && menu.sections && (
        <div className={styles.sections}>
          {menu.sections.map((section: any, idx: number) => (
            <div key={idx} className={styles.sectionGroup}>
              <h3 className={styles.sectionHeading}>
                {section.sectionType && SECTION_TYPE_LABELS[section.sectionType]
                  ? (SECTION_TYPE_LABELS[section.sectionType][locale] ?? SECTION_TYPE_LABELS[section.sectionType].bg)
                  : t(section.heading, locale)}
              </h3>
              <div className={styles.dishes}>
                {section.dishes && section.dishes.map((dish: any, dishIdx: number) => {
                  const priceNum = parseDishPrice(dish.price)
                  return (
                    <div key={dishIdx} className={styles.dish}>
                      {/* Dish image */}
                      {dish.image && (
                        <div className={styles.dishImageWrapper}>
                          <img
                            src={dish.image}
                            alt={t(dish.name, locale)}
                            className={styles.dishImage}
                          />
                        </div>
                      )}
                      <div className={styles.dishBody}>
                        <div className={styles.dishHeader}>
                          <h4 className={styles.dishName}>
                            {t(dish.name, locale)}
                          </h4>
                          {priceNum != null && (showPriceEur || showPriceBgn) && (
                            <div className={styles.dishPriceSection}>
                              {showPriceEur && (
                                <span className={styles.dishPriceEur}>
                                  € {priceNum.toFixed(2)}
                                </span>
                              )}
                              {showPriceBgn && (
                                <span className={styles.dishPriceBgn}>
                                  {(priceNum * EUR_TO_BGN).toFixed(2)} лв.
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        {dish.description && (
                          <p className={styles.dishDescription}>
                            {t(dish.description, locale)}
                          </p>
                        )}
                        {dish.tags && dish.tags.length > 0 && (
                          <div className={styles.tags}>
                            {dish.tags.map((tag: string) => (
                              <span key={tag} className={styles.tag}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
