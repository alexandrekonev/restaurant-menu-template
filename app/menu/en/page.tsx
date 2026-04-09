import { client } from '@/sanity/lib/client'
import {
  categoriesQuery,
  menuItemsQuery,
  settingsQuery,
  todayMenuQuery,
} from '@/sanity/lib/queries'
import MenuShell, { CategoryData, MenuItemData } from '@/components/MenuShell'

export const revalidate = 10

async function getMenuData() {
  const categories = await client.fetch<CategoryData[]>(categoriesQuery)
  const items = await client.fetch<MenuItemData[]>(menuItemsQuery)
  const settings = await client.fetch<any>(settingsQuery)

  const today = new Date().toISOString().split('T')[0]
  const dailyMenu = await client.fetch<any>(todayMenuQuery, { today })

  return { categories, items, settings, dailyMenu }
}

export default async function MenuEnPage() {
  const { categories, items, settings, dailyMenu } = await getMenuData()

  return (
    <MenuShell
      categories={categories}
      items={items}
      settings={settings}
      dailyMenu={dailyMenu}
      locale="en"
    />
  )
}
