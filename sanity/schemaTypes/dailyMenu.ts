import { defineField, defineType } from 'sanity'

const timeRegex = /^([01]\d|2[0-4]):([0-5]\d)$/

export default defineType({
  name: 'dailyMenu',
  title: 'Daily Menu',
  type: 'document',
  fields: [
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
      name: 'title',
      title: 'Наименование на менюто',
      type: 'object',
      description: 'Напр. "Обедно меню", "Бизнес обяд", "Седмично меню". Ако е празно — използва се настройката от Site Settings.',
      fields: [
        { name: 'bg', title: '🇧🇬 Български', type: 'string' },
        { name: 'en', title: '🇬🇧 English', type: 'string' },
      ],
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
          fields: [
            {
              name: 'heading',
              title: 'Heading',
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
