import { defineField, defineType } from 'sanity'

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
      name: 'validFrom',
      title: 'Valid From',
      type: 'string',
      options: {
        list: [
          '10:00','10:30','11:00','11:30',
          '12:00','12:30','13:00','13:30',
          '14:00','14:30','15:00','15:30',
        ],
      },
    }),
    defineField({
      name: 'validUntil',
      title: 'Valid Until',
      type: 'string',
      options: {
        list: [
          '12:00','12:30','13:00','13:30',
          '14:00','14:30','15:00','15:30',
          '16:00','16:30','17:00',
        ],
      },
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
              title: 'Dishes',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'dish',
                  title: 'Dish',
                  preview: {
                    select: {
                      title: 'name.bg',
                      subtitle: 'price',
                    },
                    prepare({ title, subtitle }: { title?: string; subtitle?: number }) {
                      return {
                        title: title || '—',
                        subtitle: subtitle != null ? `€ ${Number(subtitle).toFixed(2)}` : '',
                      }
                    },
                  },
                  fields: [
                    {
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
                    },
                    {
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
                    },
                    {
                      name: 'price',
                      title: 'Цена (EUR, цяло число)',
                      description: 'Въведи цяло число — напр. 12. Системата показва € 12.00 и стойността в лева.',
                      type: 'number',
                    },
                    {
                      name: 'tags',
                      title: 'Tags',
                      type: 'array',
                      of: [{ type: 'string' }],
                    },
                    {
                      name: 'image',
                      title: 'Image',
                      type: 'image',
                      options: {
                        hotspot: true,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
})
