import { client } from '@/sanity/lib/client'
import { todayMenuQuery } from '@/sanity/lib/queries'
import DailyMenuSection from '@/components/DailyMenuSection'
import { ui_t } from '@/lib/i18n'
import styles from './lunch.module.css'

export const revalidate = 60

async function getLunchData() {
  const today = new Date().toISOString().split('T')[0]
  const dailyMenu = await client.fetch<any>(todayMenuQuery, { today })
  return dailyMenu
}

export default async function LunchPage() {
  const dailyMenu = await getLunchData()

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{ui_t('lunchMenu', 'bg')}</h1>
        <a href="/menu" className={styles.backLink}>
          {ui_t('back', 'bg')}
        </a>
      </header>
      <main className={styles.main}>
        <DailyMenuSection menu={dailyMenu} locale="bg" />
      </main>
    </div>
  )
}
