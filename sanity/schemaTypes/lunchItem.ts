import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'lunchItem',
  title: 'Артикул за обедно меню',
  type: 'document',
  preview: {
    select: { bg: 'name.bg', price: 'price' },
    prepare({ bg, price }: { bg?: string; price?: string }) {
      return {
        title: bg || 'Без название',
        subtitle: price ? `${price} лв.` : '',
      }
    },
  },
  fields: [
    defineField({
      name: 'name',
      title: 'Название',
      type: 'object',
      fields: [
        {
          name: 'bg',
          title: '🇧🇬 Български',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        { name: 'en', title: '🇬🇧 English', type: 'string' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Описание',
      type: 'object',
      fields: [
        { name: 'bg', title: '🇧🇬 Български', type: 'string' },
        { name: 'en', title: '🇬🇧 English', type: 'string' },
      ],
    }),
    defineField({
      name: 'price',
      title: 'Цена',
      type: 'string',
      description: 'Напр. "12" или "12.50"',
    }),
    defineField({
      name: 'tags',
      title: 'Тагове',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: '🌱 Вегетарианско', value: 'vegetarian' },
          { title: '🌿 Веган',         value: 'vegan' },
          { title: '⚡ Без глутен',    value: 'gluten-free' },
          { title: '🌶 Лютиво',        value: 'spicy' },
        ],
      },
    }),
    defineField({
      name: 'image',
      title: 'Снимка',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
})
