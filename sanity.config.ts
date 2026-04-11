import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import { CategoryOrderableList } from './sanity/components/CategoryOrderableList'

export default defineConfig({
  name: 'restaurant-menu',
  title: 'Restaurant Menu Studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            // ── Site Settings (singleton) ──
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Site Settings')
              ),

            S.divider(),

            // ── Categories — drag to reorder ──
            orderableDocumentListDeskItem({
              type: 'category',
              title: 'Categories',
              S,
              context,
            }),

            S.divider(),

            // ── Menu Items by Category — custom drag-and-drop per category ──
            // Drag rows to reorder. Click the edit icon to open an item.
            S.listItem()
              .title('Menu Items by Category')
              .id('menuItemsByCategory')
              .child(
                S.documentTypeList('category')
                  .title('Избери категория')
                  .child((categoryId: string) =>
                    S.component(CategoryOrderableList)
                      .id(`cat-orderable-${categoryId}`)
                      .title('Артикули')
                      .options({ categoryId })
                  )
              ),

            // ── All Menu Items (flat, orderable) ──
            orderableDocumentListDeskItem({
              type: 'menuItem',
              title: 'All Menu Items',
              id: 'allMenuItems',
              S,
              context,
            }),

            // ── All Menu Items — Alphabetical ──
            S.listItem()
              .title('Артикули (А→Я)')
              .id('allMenuItemsAlpha')
              .child(
                S.documentTypeList('menuItem')
                  .title('Артикули по азбучен ред')
                  .defaultOrdering([{ field: 'name.bg', direction: 'asc' }])
              ),

            S.divider(),

            // ── Daily Menu (Lunch) ──
            S.listItem()
              .title('Daily Menu (Lunch)')
              .id('dailyMenu')
              .child(
                S.documentTypeList('dailyMenu')
                  .title('Daily Menu')
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
})
