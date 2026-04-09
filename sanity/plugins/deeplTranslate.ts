/**
 * DeepL Translation — Custom Sanity Document Action
 *
 * Adds a "Translate BG → EN" button to the Studio toolbar.
 * When clicked, it reads all BG fields in the current document,
 * sends them to our /api/translate endpoint, and patches the EN fields.
 *
 * Setup:
 *  1. Add DEEPL_API_KEY to .env.local
 *  2. The action appears in the Studio for menuItem, category, dailyMenu documents
 */

import { definePlugin } from 'sanity'
import type { DocumentActionComponent, DocumentActionProps } from 'sanity'

// Fields that have localized { bg, en } structure
const LOCALIZED_FIELDS = ['name', 'description', 'chefNote', 'footerNote', 'happyHourText']
// Nested paths in dailyMenu sections
const NESTED_SECTION_FIELDS = ['heading', 'name', 'description']

function TranslateAction(props: DocumentActionProps): ReturnType<DocumentActionComponent> {
  const { draft, published, id, type } = props

  const doc = draft || published

  // Only show for our content types
  const applicableTypes = ['menuItem', 'category', 'dailyMenu', 'siteSettings']
  if (!applicableTypes.includes(type)) return null

  return {
    label: '🌐 Translate BG → EN',
    title: 'Автоматичен превод от Български на Английски чрез DeepL',
    onHandle: async () => {
      if (!doc) return

      // Collect all BG strings that need translating
      const toTranslate: { path: string; text: string }[] = []

      // Top-level localized fields
      for (const field of LOCALIZED_FIELDS) {
        const val = (doc as Record<string, unknown>)[field]
        if (val && typeof val === 'object') {
          const locVal = val as { bg?: string; en?: string }
          if (locVal.bg && locVal.bg.trim()) {
            toTranslate.push({ path: field, text: locVal.bg })
          }
        }
      }

      // dailyMenu sections[].heading and sections[].dishes[].name/description
      if (type === 'dailyMenu') {
        const sections = (doc as Record<string, unknown>).sections as Array<Record<string, unknown>> | undefined
        sections?.forEach((section, si) => {
          for (const f of NESTED_SECTION_FIELDS) {
            const val = section[f] as { bg?: string } | undefined
            if (val?.bg?.trim()) {
              toTranslate.push({ path: `sections.${si}.${f}`, text: val.bg })
            }
          }
          const dishes = section.dishes as Array<Record<string, unknown>> | undefined
          dishes?.forEach((dish, di) => {
            for (const f of ['name', 'description']) {
              const val = dish[f] as { bg?: string } | undefined
              if (val?.bg?.trim()) {
                toTranslate.push({ path: `sections.${si}.dishes.${di}.${f}`, text: val.bg })
              }
            }
          })
        })
      }

      if (!toTranslate.length) {
        alert('Няма BG текст за превод.')
        return
      }

      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ texts: toTranslate.map((t) => t.text) }),
        })

        if (!res.ok) throw new Error(await res.text())
        const { translations } = await res.json() as { translations: string[] }

        // Build patch object
        const patch: Record<string, unknown> = {}
        toTranslate.forEach((item, i) => {
          // Convert dot path to Sanity patch path
          patch[item.path + '.en'] = translations[i]
        })

        // Apply via Sanity client
        const { createClient } = await import('@sanity/client')
        const pClient = createClient({
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
          apiVersion: '2024-06-01',
          useCdn: false,
          token: undefined, // uses Studio session token
        })

        await pClient.patch(id).set(patch).commit()
        alert(`✅ Преведени ${translations.length} поле(та). Провери EN полетата.`)
      } catch (err) {
        console.error('DeepL translate error:', err)
        alert('❌ Грешка при превода. Провери DeepL API ключа.')
      }
    },
  }
}

export const deeplTranslatePlugin = definePlugin({
  name: 'deepl-translate',
  document: {
    actions: (prev) => [...prev, TranslateAction as DocumentActionComponent],
  },
})
