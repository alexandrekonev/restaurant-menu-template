import { useEffect, useRef, useState } from 'react'
import { useClient } from 'sanity'
import { IntentLink } from 'sanity/router'
import { Badge, Box, Card, Flex, Spinner, Stack, Text } from '@sanity/ui'
import { DragHandleIcon, EditIcon } from '@sanity/icons'

const ITEM_QUERY = `
  *[_type == "menuItem" && category._ref == $categoryId]
  | order(order asc, _createdAt asc) {
    _id,
    name,
    order,
    isFeatured,
    isNew
  }
`

interface MenuItem {
  _id: string
  name: { bg?: string | null; en?: string | null } | null
  order: number
  isFeatured?: boolean | null
  isNew?: boolean | null
}

export function CategoryOrderableList(props: { options?: Record<string, unknown> }) {
  const categoryId = props.options?.categoryId as string | undefined
  const client = useClient({ apiVersion: '2024-01-01' })

  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const dragItemRef = useRef<number | null>(null)
  const dragOverRef = useRef<number | null>(null)
  const isReordering = useRef(false)

  // ── Fetch + live subscribe ────────────────────────────────────────────────
  useEffect(() => {
    if (!categoryId) return

    const params = { categoryId }
    setLoading(true)

    client.fetch<MenuItem[]>(ITEM_QUERY, params).then((result) => {
      setItems(result)
      setLoading(false)
    })

    const sub = client.listen(ITEM_QUERY, params).subscribe((event) => {
      // Skip refetch during our own reorder commit to avoid flicker
      if (event.type === 'mutation' && !isReordering.current) {
        client.fetch<MenuItem[]>(ITEM_QUERY, params).then(setItems)
      }
    })

    return () => sub.unsubscribe()
  }, [client, categoryId])

  // ── Drag handlers ─────────────────────────────────────────────────────────
  const handleDragStart = (index: number) => {
    dragItemRef.current = index
    setDraggingIndex(index)
  }

  const handleDragEnter = (index: number) => {
    if (dragItemRef.current === index) return
    dragOverRef.current = index
    setDragOverIndex(index)
  }

  const handleDragEnd = async () => {
    const from = dragItemRef.current
    const to = dragOverRef.current

    setDraggingIndex(null)
    setDragOverIndex(null)
    dragItemRef.current = null
    dragOverRef.current = null

    if (from === null || to === null || from === to) return

    // Build new order optimistically
    const newItems = [...items]
    const [moved] = newItems.splice(from, 1)
    newItems.splice(to, 0, moved)
    setItems(newItems)

    // Persist: assign sequential integers 1, 2, 3 … to all items in category
    isReordering.current = true
    try {
      const transaction = client.transaction()
      newItems.forEach((item, idx) => {
        transaction.patch(item._id, { set: { order: idx + 1 } })
      })
      await transaction.commit()
    } catch (err) {
      console.error('[CategoryOrderableList] Грешка при запис:', err)
      // Roll back to server state on failure
      client
        .fetch<MenuItem[]>(ITEM_QUERY, { categoryId })
        .then(setItems)
    } finally {
      isReordering.current = false
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (!categoryId) {
    return (
      <Box padding={4}>
        <Text muted>Изберете категория</Text>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box padding={4}>
        <Flex align="center" gap={3}>
          <Spinner />
          <Text muted>Зареждане…</Text>
        </Flex>
      </Box>
    )
  }

  if (items.length === 0) {
    return (
      <Box padding={4}>
        <Text muted>Няма артикули в тази категория</Text>
      </Box>
    )
  }

  return (
    <Box padding={4}>
      <Stack space={1}>
        {items.map((item, index) => (
          <Card
            key={item._id}
            padding={3}
            radius={2}
            tone={dragOverIndex === index ? 'primary' : 'default'}
            shadow={dragOverIndex === index ? 1 : undefined}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            style={{
              cursor: 'grab',
              opacity: draggingIndex === index ? 0.35 : 1,
              transition: 'opacity 0.1s',
            }}
          >
            <Flex align="center" gap={3}>
              {/* Drag handle */}
              <Text muted size={2} style={{ pointerEvents: 'none' }}>
                <DragHandleIcon />
              </Text>

              {/* Name + badges */}
              <Box flex={1}>
                <Flex align="center" gap={2} wrap="wrap">
                  <Text size={2} weight="semibold">
                    {item.name?.bg || item.name?.en || '(без наименование)'}
                  </Text>
                  {item.isFeatured && <Badge tone="positive">Featured</Badge>}
                  {item.isNew && <Badge tone="caution">New</Badge>}
                </Flex>
              </Box>

              {/* Position indicator */}
              <Text muted size={1}>
                #{index + 1}
              </Text>

              {/* Edit link — navigates to document editor */}
              <IntentLink
                intent="edit"
                params={{ id: item._id, type: 'menuItem' }}
                onClick={(e) => e.stopPropagation()}
                style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}
              >
                <EditIcon />
              </IntentLink>
            </Flex>
          </Card>
        ))}
      </Stack>

      <Box paddingTop={3}>
        <Text muted size={1}>
          Влачете ред, за да пренаредите • Кликнете &nbsp;
          <EditIcon style={{ verticalAlign: 'middle' }} />
          &nbsp; за да редактирате артикул
        </Text>
      </Box>
    </Box>
  )
}
