import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { client } from '@/sanity/lib/client'
import { settingsQuery } from '@/sanity/lib/queries'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { eventType, name, phone, email, date, guests, message, locale, venueName } = body

    // Fetch the recipient email from Sanity Settings
    const settings = await client.fetch<any>(settingsQuery)
    const recipientEmail = settings?.reservationEmail

    if (!recipientEmail) {
      return NextResponse.json(
        { error: 'No reservation email configured in Site Settings' },
        { status: 500 }
      )
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY not configured' },
        { status: 500 }
      )
    }

    const isBg = locale === 'bg'
    const subject = isBg
      ? `Нова резервация — ${name} | ${venueName}`
      : `New reservation — ${name} | ${venueName}`

    const html = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #8B6914; border-bottom: 1px solid #ddd; padding-bottom: 0.5rem;">
          ${isBg ? 'Нова заявка за резервация' : 'New reservation request'}
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
          <tbody>
            ${eventType ? `<tr><td style="padding: 0.4rem 0; color: #666; width: 40%">${isBg ? 'Тип събитие' : 'Event type'}</td><td style="padding: 0.4rem 0;"><strong>${eventType}</strong></td></tr>` : ''}
            <tr><td style="padding: 0.4rem 0; color: #666;">${isBg ? 'Имена' : 'Name'}</td><td style="padding: 0.4rem 0;"><strong>${name}</strong></td></tr>
            <tr><td style="padding: 0.4rem 0; color: #666;">${isBg ? 'Телефон' : 'Phone'}</td><td style="padding: 0.4rem 0;">${phone || '—'}</td></tr>
            <tr><td style="padding: 0.4rem 0; color: #666;">Email</td><td style="padding: 0.4rem 0;">${email || '—'}</td></tr>
            <tr><td style="padding: 0.4rem 0; color: #666;">${isBg ? 'Дата' : 'Date'}</td><td style="padding: 0.4rem 0;">${date || '—'}</td></tr>
            <tr><td style="padding: 0.4rem 0; color: #666;">${isBg ? 'Брой гости' : 'Guests'}</td><td style="padding: 0.4rem 0;">${guests || '—'}</td></tr>
          </tbody>
        </table>
        ${message ? `
          <div style="margin-top: 1rem; padding: 1rem; background: #f9f9f9; border-radius: 4px;">
            <p style="margin: 0 0 0.5rem; color: #666; font-size: 0.9rem;">${isBg ? 'Бележки' : 'Notes'}:</p>
            <p style="margin: 0;">${message}</p>
          </div>
        ` : ''}
        <hr style="margin: 1.5rem 0; border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 0.8rem; color: #999;">${venueName} — Digital Menu</p>
      </div>
    `

    await resend.emails.send({
      from: `${venueName} Reservations <onboarding@resend.dev>`,
      to: [recipientEmail],
      replyTo: email || undefined,
      subject,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[Reservation API]', error)
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 })
  }
}
