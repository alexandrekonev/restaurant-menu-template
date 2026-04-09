import { Locale, t, toBgn } from '@/lib/i18n'
import { MenuItemData } from './MenuShell'
import styles from './ItemCard.module.css'

interface ItemCardProps {
  item: MenuItemData
  locale: Locale
  showPriceBgn?: boolean
  showPriceEur?: boolean
}

export default function ItemCard({ item, locale, showPriceBgn = true, showPriceEur = true }: ItemCardProps) {
  const allTags = [...(item.tags || []), ...(item.customTags || [])]

  return (
    <div className={styles.cardOuter}>
      <div className={`${styles.card} ${item.isFeatured ? styles.featured : ''}`}>
        {/* Image Section */}
        {item.image && (
          <div className={styles.imageWrapper}>
            <img
              src={item.image}
              alt={t(item.name, locale)}
              className={styles.image}
            />
          </div>
        )}

        {/* Content Section */}
        <div className={styles.content}>
          <h3 className={styles.name}>{t(item.name, locale)}</h3>
          {item.isFeatured && (
            <span className={styles.featuredBadge}>
              ⭐ {locale === 'bg' ? 'Препоръчано' : 'Featured'}
            </span>
          )}

          {item.description && (
            <p className={styles.description}>{t(item.description, locale)}</p>
          )}

          {item.volume && (
            <p className={styles.volume}>
              <span className={styles.volumeLabel}>Vol:</span> {item.volume}
            </p>
          )}

          {/* Tags */}
          {allTags.length > 0 && (
            <div className={styles.tags}>
              {allTags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}

          {/* Allergens */}
          {item.allergens && item.allergens.length > 0 && (
            <div className={styles.allergens}>
              <strong>⚠️</strong> {item.allergens.join(', ')}
            </div>
          )}

          {/* Price */}
          {(showPriceBgn || showPriceEur) && (
            <div className={styles.priceSection}>
              {showPriceEur && <span className={styles.priceEur}>€ {item.price}</span>}
              {showPriceBgn && <span className={styles.price}>{toBgn(item.price)} лв.</span>}
            </div>
          )}
        </div>

        {/* NEW badge — inside card, top-right corner over image area */}
        {item.isNew && (
          <span className={styles.newBadge}>
            {locale === 'bg' ? 'НОВО' : 'NEW'}
          </span>
        )}
      </div>
    </div>
  )
}
