import { useState } from 'react'
import { useDocumentOperation, useClient } from 'sanity'
import type { DocumentActionComponent } from 'sanity'

/**
 * Replaces the default Publish action for menuItem documents.
 * When the `order` field changes, all sibling items in the same category
 * with order >= newOrder are automatically shifted down by 1 before publishing.
 */
export const ReorderPublishAction: DocumentActionComponent = (props) => {
  const { id, draft, published, onComplete } = props
  const { publish } = useDocumentOperation(id, 'menuItem')
  const client = useClient({ apiVersion: '2024-01-01' })
  const [isWorking, setIsWorking] = useState(false)

  return {
    label: isWorking ? 'Запазване...' : 'Публикуване',
    tone: 'primary',
    disabled: !!publish.disabled || isWorking,
    onHandle: async () => {
      setIsWorking(true)

      try {
        const currentDoc = draft ?? published
        const newOrder = (currentDoc as Record<string, unknown>)?.order as number | undefined
        const categoryRef = ((currentDoc as Record<string, unknown>)?.category as Record<string, string> | undefined)?._ref
        const prevOrder = (published as Record<string, unknown>)?.order as number | undefined

        // Only auto-shift when order has actually changed
        const shouldReorder =
          typeof newOrder === 'number' &&
          typeof categoryRef === 'string' &&
          newOrder !== prevOrder

        if (shouldReorder) {
          // Find all published sibling items in the same category with order >= newOrder
          const siblings = await client.fetch<Array<{ _id: string; order: number }>>(
            `*[_type == "menuItem" && category._ref == $categoryRef && order >= $newOrder && _id != $currentId] { _id, order }`,
            { categoryRef, newOrder, currentId: id }
          )

          if (siblings.length > 0) {
            const transaction = client.transaction()
            for (const sibling of siblings) {
              transaction.patch(sibling._id, {
                set: { order: (sibling.order ?? 0) + 1 },
              })
            }
            await transaction.commit()
          }
        }

        publish.execute()
        onComplete()
      } catch (err) {
        console.error('[ReorderPublish] грешка при пренареждане:', err)
        setIsWorking(false)
      }
    },
  }
}

// Required so Sanity can identify and replace the default publish action
;(ReorderPublishAction as unknown as { action: string }).action = 'publish'
