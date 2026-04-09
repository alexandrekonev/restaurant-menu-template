import { defineField, defineType } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  orderings: [orderRankOrdering],
  preview: {
    select: {
      title: 'name.bg',
      subtitle: 'displayStyle',
    },
  },
  fields: [
    orderRankField({ type: 'category' }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'object',
      fields: [
        {
          name: 'bg',
          title: 'Bulgarian',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'en',
          title: 'English',
          type: 'string',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name.bg',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon (Emoji)',
      type: 'string',
    }),
    defineField({
      name: 'displayStyle',
      title: 'Display Style',
      type: 'string',
      options: {
        list: [
          { title: 'Cards (2-column grid)', value: 'cards' },
          { title: 'List', value: 'list' },
          { title: 'Compact', value: 'compact' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
})
