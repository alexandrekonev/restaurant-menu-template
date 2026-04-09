import { defineType, defineField } from 'sanity'

export const menuCategory = defineType({
  name: 'menuCategory',
  title: 'Menu Category',
  type: 'document',
  icon: () => '📂',
  fields: [
    defineField({
      name: 'title',
      title: 'Category Name',
      type: 'string',
      description: 'e.g. Signature Cocktails, Whisky, Wine',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL key)',
      type: 'slug',
      options: { source: 'title', maxLength: 48 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle / Description',
      type: 'string',
      description: 'Short line shown under the category heading (e.g. "50ml serve")',
    }),
    defineField({
      name: 'displayStyle',
      title: 'Display Style',
      type: 'string',
      options: {
        list: [
          { title: 'Cards with photos (cocktails, beer)', value: 'cards' },
          { title: 'List with photo (spirits, wine)', value: 'list' },
          { title: 'Compact list (soft drinks, water)', value: 'compact' },
        ],
        layout: 'radio',
      },
      initialValue: 'cards',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first in the navigation',
      initialValue: 10,
    }),
    defineField({
      name: 'active',
      title: 'Active / Visible',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to temporarily hide this category from the menu',
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'subtitle', active: 'active' },
    prepare({ title, subtitle, active }) {
      return {
        title: `${active ? '✅' : '🚫'} ${title ?? ''}`,
        subtitle: subtitle ?? '',
      }
    },
  },
})