import { defineType, defineField } from 'sanity'

export const lunchMenu = defineType({
  name: 'lunchMenu',
  title: 'Daily Lunch Menu',
  type: 'document',
  icon: () => '🍽',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      options: { dateFormat: 'DD/MM/YYYY' },
      validation: (R) => R.required(),
      description: 'The date this lunch menu is served',
    }),
    defineField({
      name: 'title',
      title: 'Menu Title (optional)',
      type: 'string',
      description: 'e.g. "Chef\'s Weekly Special" — leave blank for default',
      placeholder: 'Today\'s Lunch',
    }),
    defineField({
      name: 'published',
      title: 'Published / Visible',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle off to prepare tomorrow\'s menu without showing it yet',
    }),
    defineField({
      name: 'sections',
      title: 'Menu Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'lunchSection',
          title: 'Section',
          fields: [
            defineField({
              name: 'heading',
              title: 'Section Heading',
              type: 'string',
              description: 'e.g. "Soups", "Main Course", "Dessert", "Set Menu"',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'items',
              title: 'Dishes',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'dish',
                  fields: [
                    defineField({
                      name: 'name',
                      title: 'Dish Name',
                      type: 'string',
                      validation: (R) => R.required(),
                    }),
                    defineField({
                      name: 'description',
                      title: 'Description',
                      type: 'text',
                      rows: 2,
                    }),
                    defineField({
                      name: 'photo',
                      title: 'Photo',
                      type: 'image',
                      options: { hotspot: true },
                    }),
                    defineField({
                      name: 'price',
                      title: 'Price (€)',
                      type: 'string',
                    }),
                    defineField({
                      name: 'tags',
                      title: 'Tags',
                      type: 'array',
                      of: [{ type: 'string' }],
                      options: {
                        list: [
                          { title: '🌱 Vegetarian', value: 'vegetarian' },
                          { title: '🌿 Vegan', value: 'vegan' },
                          { title: '🌾 Gluten-free', value: 'gluten-free' },
                          { title: '🐟 Fish', value: 'fish' },
                          { title: '🥩 Meat', value: 'meat' },
                          { title: '⭐ Chef\'s Special', value: 'special' },
                        ],
                        layout: 'grid',
                      },
                    }),
                  ],
                  preview: {
                    select: { title: 'name', subtitle: 'price', media: 'photo' },
                    prepare({ title, subtitle, media }) {
                      return { title, subtitle: subtitle ? `${subtitle} €` : '', media }
                    },
                  },
                },
              ],
              validation: (R) => R.min(1),
            }),
          ],
          preview: {
            select: { title: 'heading' },
            prepare({ title }) {
              return { title: `📋 ${title}` }
            },
          },
        },
      ],
      validation: (R) => R.min(1),
    }),
    defineField({
      name: 'note',
      title: 'Chef\'s Note (optional)',
      type: 'text',
      rows: 2,
      description: 'A short message from the kitchen — shown at the top of the lunch menu',
    }),
  ],
  preview: {
    select: { title: 'date', subtitle: 'title', published: 'published' },
    prepare({ title, subtitle, published }) {
      const d = title ? new Date(title).toLocaleDateString('bg-BG', {
        weekday: 'long', day: 'numeric', month: 'long',
      }) : 'No date'
      return {
        title: `${published ? '✅' : '📝'} ${d}`,
        subtitle: subtitle || 'Обяд',
      }
    },
  },
  orderings: [{ title: 'Дата низходящо', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
})