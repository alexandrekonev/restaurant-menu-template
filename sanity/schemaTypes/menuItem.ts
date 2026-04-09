import { defineField, defineType } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'

export default defineType({
  name: 'menuItem',
  title: 'Menu Item',
  type: 'document',
  orderings: [
    orderRankOrdering,
    { title: 'А→Я (Bulgarian)',  name: 'nameBgAsc',    by: [{ field: 'name.bg',     direction: 'asc'  }] },
    { title: 'A→Z (English)',    name: 'nameEnAsc',    by: [{ field: 'name.en',     direction: 'asc'  }] },
    { title: 'Newest First',     name: 'createdDesc',  by: [{ field: '_createdAt',  direction: 'desc' }] },
    { title: 'Oldest First',     name: 'createdAsc',   by: [{ field: '_createdAt',  direction: 'asc'  }] },
    { title: 'Featured First',   name: 'featuredDesc', by: [{ field: 'isFeatured',  direction: 'desc' }] },
    { title: 'New Items First',  name: 'newDesc',      by: [{ field: 'isNew',       direction: 'desc' }] },
    { title: 'Price Low→High',   name: 'priceAsc',     by: [{ field: 'price',       direction: 'asc'  }] },
    { title: 'Price High→Low',   name: 'priceDesc',    by: [{ field: 'price',       direction: 'desc' }] },
  ],
  preview: {
    select: {
      title: 'name.bg',
      subtitle: 'price',
    },
  },
  fields: [
    orderRankField({ type: 'menuItem' }),
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
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        {
          name: 'bg',
          title: 'Bulgarian',
          type: 'string',
        },
        {
          name: 'en',
          title: 'English',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'Enter price in EUR — e.g. "4.60" or "6 / 28" (glass/bottle). BGN is auto-calculated.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'volume',
      title: 'Volume',
      type: 'string',
      description: 'e.g. "50ml"',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subCategory',
      title: 'Sub Category',
      type: 'string',
    }),
    defineField({
      name: 'tags',
      title: 'Тагове (предефинирани)',
      description: 'Изберете тагове с чекбокс.',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Пикантно / Spicy', value: 'Пикантно' },
          { title: 'Веган / Vegan', value: 'Веган' },
          { title: 'Вегетарианско / Vegetarian', value: 'Вегетарианско' },
          { title: 'Без глутен / Gluten-Free', value: 'Без глутен' },
          { title: 'Без лактоза / Dairy-Free', value: 'Без лактоза' },
          { title: 'Препоръчано / Featured', value: 'Препоръчано' },
          { title: 'Сезонно / Seasonal', value: 'Сезонно' },
          { title: 'Домашно / Homemade', value: 'Домашно' },
          { title: 'Алкохолно / Alcoholic', value: 'Алкохолно' },
          { title: 'Безалкохолно / Non-Alcoholic', value: 'Безалкохолно' },
        ],
      },
    }),
    defineField({
      name: 'customTags',
      title: 'Допълнителни тагове',
      description: 'Въведете допълнителен таг на двата езика — напр. "Домашна рецепта / House Recipe". Натиснете Enter за добавяне.',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'isFeatured',
      title: 'Препоръчано (Featured)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isNew',
      title: 'Ново (New)',
      description: 'Показва badge "НОВО" върху артикула.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'allergens',
      title: 'Allergens',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'isAvailable',
      title: 'Available',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Позиция в категорията',
      description:
        'Въведете номер (1, 2, 3 …). При публикуване, всички артикули в същата категория с равен или по-висок номер автоматично ще се изместят с един надолу. Нови артикули без зададена позиция се появяват в края.',
      type: 'number',
      initialValue: 999,
    }),
  ],
})
