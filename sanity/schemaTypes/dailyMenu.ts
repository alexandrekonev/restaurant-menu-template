import { defineField, defineType } from 'sanity'

const timeRegex = /^([01]\d|2[0-4]):([0-5]\d)$/

export default defineType({
  name: 'dailyMenu',
  title: 'Daily Menu',
  type: 'document',
  preview: {
    select: {
      titleBg: 'title.bg',
      date: 'date',
    },
    prepare({ titleBg, date }: { titleBg?: string; date?: string }) {
      return {
        title: titleBg || date || 'Дневно меню',
        subtitle: date || '',
      }
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Наименование на менюто',
      type: 'object',
      description: 'Напр. "Обедно меню", "Бизнес обяд", "Седмично меню". Ако е празно — използва се настройката от Site Settings.',
      fields: [
        {
          name: 'bg',
          title: '🇧🇬 Български',
          type: 'string',
          placeholder: 'Обедно меню',
          validation: (Rule) => Rule.required(),
        },
        { name: 'en', title: '🇬🇧 English', type: 'string', placeholder: 'Lunch Menu' },
      ],
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'validFrom',
      title: 'От час',
      type: 'string',
      description: 'Формат: HH:MM (00:00 — 24:00)',
      validation: (Rule) => Rule.regex(timeRegex, { name: 'time', invert: false }),
    }),
    defineField({
      name: 'validUntil',
      title: 'До час',
      type: 'string',
      description: 'Формат: HH:MM (00:00 — 24:00)',
      validation: (Rule) => Rule.regex(timeRegex, { name: 'time', invert: false }),
    }),
    defineField({
      name: 'chefNote',
      title: 'Описание от Шефа',
      description: 'Свободен текст — поддържа удебелен, курсив и списъци. Всеки ред/параграф е на нов ред на менюто.',
      type: 'object',
      fields: [
        {
          name: 'bg',
          title: 'Български',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [{ title: 'Normal', value: 'normal' }],
              lists: [
                { title: 'Bullet', value: 'bullet' },
                { title: 'Numbered', value: 'number' },
              ],
              marks: {
                decorators: [
                  { title: 'Bold', value: 'strong' },
                  { title: 'Italic', value: 'em' },
                ],
                annotations: [],
              },
            },
          ],
        },
        {
          name: 'en',
          title: 'English',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [{ title: 'Normal', value: 'normal' }],
              lists: [
                { title: 'Bullet', value: 'bullet' },
                { title: 'Numbered', value: 'number' },
              ],
              marks: {
                decorators: [
                  { title: 'Bold', value: 'strong' },
                  { title: 'Italic', value: 'em' },
                ],
                annotations: [],
              },
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'menuSection',
          title: 'Menu Section',
          preview: {
            select: { sectionType: 'sectionType', headingBg: 'heading.bg' },
            prepare({ sectionType, headingBg }: { sectionType?: string; headingBg?: string }) {
              const labels: Record<string, string> = {
                soups: '🍲 Супи',
                starters: '🥗 Предястия',
                mains: '🍽 Основни ястия',
                salads: '🥬 Салати',
                desserts: '🍰 Десерти',
                surprises: '🎁 Изненади',
              }
              return { title: (sectionType && labels[sectionType]) || headingBg || 'Секция' }
            },
          },
          fields: [
            {
              name: 'sectionType',
              title: 'Тип секция',
              type: 'string',
              options: {
                list: [
                  { title: '🍲 Супи',            value: 'soups' },
                  { title: '🥗 Предястия',        value: 'starters' },
                  { title: '🍽 Основни ястия',    value: 'mains' },
                  { title: '🥬 Салати',           value: 'salads' },
                  { title: '🍰 Десерти',          value: 'desserts' },
                  { title: '🎁 Изненади',         value: 'surprises' },
                ],
                layout: 'dropdown',
              },
            },
            {
              name: 'heading',
              title: 'Заглавие (по избор)',
              description: 'Попълни само ако искаш собствено заглавие вместо предефинирания тип.',
              type: 'object',
              fields: [
                { name: 'bg', title: 'Bulgarian', type: 'string' },
                { name: 'en', title: 'English', type: 'string' },
              ],
            },
            {
              name: 'dishes',
              title: 'Ястия',
              description: 'Изберете от съществуващите артикули в менюто.',
              type: 'array',
              of: [
                {
                  type: 'reference',
                  to: [{ type: 'menuItem' }],
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
})
