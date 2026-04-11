import { defineField, defineType } from 'sanity'

const timeRegex = /^([01]\d|2[0-4]):([0-5]\d)$/

const dayOptions = [
  { title: 'Понеделник / Monday', value: 'monday' },
  { title: 'Вторник / Tuesday', value: 'tuesday' },
  { title: 'Сряда / Wednesday', value: 'wednesday' },
  { title: 'Четвъртък / Thursday', value: 'thursday' },
  { title: 'Петък / Friday', value: 'friday' },
  { title: 'Събота / Saturday', value: 'saturday' },
  { title: 'Неделя / Sunday', value: 'sunday' },
]

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [

    // ── Identity ──────────────────────────────────────────────────────────────
    defineField({
      name: 'venueName',
      title: 'Venue Name',
      type: 'string',
      description: 'Used in browser tab title, footer copyright and image alt text',
      initialValue: 'My Restaurant',
    }),
    defineField({
      name: 'logoEmblem',
      title: 'Logo — Emblem / Sign',
      type: 'image',
      description: 'Small emblem displayed in the hero area and the footer',
      options: { hotspot: true },
    }),
    defineField({
      name: 'logoFull',
      title: 'Logo — Full (text version)',
      type: 'image',
      description: 'Full logotype with text, shown below the emblem in the hero',
      options: { hotspot: true },
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent Color (hex)',
      type: 'string',
      description: 'Primary accent colour used throughout the menu. Example: #8B6914',
      initialValue: '#8B6914',
      validation: (Rule) =>
        Rule.regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
          name: 'hex colour',
          invert: false,
        }).warning('Should be a valid hex color, e.g. #8B6914'),
    }),

    // ── Contact ───────────────────────────────────────────────────────────────
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
      description: 'Shown in the footer',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      description: 'Shown as a "Call" button next to the reservation form',
    }),
    defineField({
      name: 'reservationEmail',
      title: 'Reservation Email',
      type: 'string',
      description: 'Email address that receives reservation form submissions',
    }),

    // ── Social media ──────────────────────────────────────────────────────────
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      description: 'Leave empty to hide the Instagram link in the footer',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
      description: 'Leave empty to hide the Facebook link in the footer',
    }),
    defineField({
      name: 'tiktokUrl',
      title: 'TikTok URL',
      type: 'url',
      description: 'Leave empty to hide the TikTok link in the footer',
    }),
    defineField({
      name: 'googleReviewUrl',
      title: 'Google Maps / Business Page URL',
      type: 'url',
      description: 'Link to your Google Maps business listing',
    }),
    defineField({
      name: 'googleWriteReviewUrl',
      title: 'Google — Write a Review URL',
      type: 'url',
      description: 'Direct link to the Google review form. Get it from Google My Business → "Ask for reviews"',
    }),

    // ── Working hours ─────────────────────────────────────────────────────────
    defineField({
      name: 'workingHours',
      title: 'Working Hours',
      type: 'array',
      description: 'Displayed in the footer. Leave empty to hide.',
      of: [
        {
          type: 'object',
          name: 'hoursEntry',
          title: 'Hours Entry',
          fields: [
            defineField({
              name: 'day',
              title: 'Day',
              type: 'string',
              options: { list: dayOptions },
            }),
            defineField({
              name: 'hours',
              title: 'Hours',
              type: 'string',
              description: 'E.g. "12:00 – 00:00" or "Затворено / Closed"',
            }),
            defineField({
              name: 'concept',
              title: 'Concept (optional)',
              type: 'string',
              description: 'E.g. "Happy Hour 17:00 – 19:00"',
            }),
          ],
          preview: {
            select: { title: 'day', subtitle: 'hours' },
          },
        },
      ],
    }),

    // ── Happy Hour ────────────────────────────────────────────────────────────
    defineField({
      name: 'happyHourActive',
      title: 'Happy Hour Active',
      type: 'boolean',
      initialValue: false,
      description: 'Show Happy Hour banner during the selected hours',
    }),
    defineField({
      name: 'happyHourFrom',
      title: 'Happy Hour — Start',
      type: 'string',
      description: 'Формат: HH:MM (00:00 — 24:00)',
      validation: (Rule) => Rule.regex(timeRegex, { name: 'time', invert: false }),
    }),
    defineField({
      name: 'happyHourUntil',
      title: 'Happy Hour — End',
      type: 'string',
      description: 'Формат: HH:MM (00:00 — 24:00)',
      validation: (Rule) => Rule.regex(timeRegex, { name: 'time', invert: false }),
    }),
    defineField({
      name: 'happyHourText',
      title: 'Happy Hour — Banner Text',
      type: 'object',
      description: 'Text shown in the Happy Hour banner (optional)',
      fields: [
        { name: 'bg', title: 'Bulgarian', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
      ],
    }),

    // ── Lunch / Daily Menu ────────────────────────────────────────────────────
    defineField({
      name: 'lunchMenuActive',
      title: 'Lunch Menu Active',
      type: 'boolean',
      initialValue: false,
      description: 'Show the daily lunch menu section on the page',
    }),
    defineField({
      name: 'lunchMenuTitle',
      title: 'Lunch Menu — Section Title',
      type: 'object',
      description: 'Custom title for the lunch menu section (default: "Обедно меню")',
      fields: [
        { name: 'bg', title: 'Bulgarian', type: 'string', placeholder: 'Обедно меню' },
        { name: 'en', title: 'English', type: 'string', placeholder: 'Lunch Menu' },
      ],
    }),

    // ── Price display ─────────────────────────────────────────────────────────
    defineField({
      name: 'showPriceEur',
      title: 'Show prices in EUR (€)',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showPriceBgn',
      title: 'Show prices in BGN (лв.) — auto-converted',
      type: 'boolean',
      initialValue: true,
      description: 'BGN is calculated automatically: 1 EUR = 1.95583 лв.',
    }),

    // ── Footer ────────────────────────────────────────────────────────────────
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
    }),
    defineField({
      name: 'footerNote',
      title: 'Footer Note',
      type: 'object',
      fields: [
        { name: 'bg', title: 'Bulgarian', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
      ],
    }),
  ],
})