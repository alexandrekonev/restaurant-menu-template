'use client'

import { useState } from 'react'
import type { Locale } from '@/lib/i18n'
import styles from './ReservationModal.module.css'

const EVENT_TYPES_BG = ['Рожден ден', 'Годишнина', 'Бизнес събитие', 'Приятелска вечеря', 'Друго']
const EVENT_TYPES_EN = ['Birthday', 'Anniversary', 'Business event', 'Friends dinner', 'Other']

interface Props {
  locale: Locale
  venueName: string
  onClose: () => void
}

export default function ReservationModal({ locale, venueName, onClose }: Props) {
  const [form, setForm] = useState({
    eventType: '',
    name: '',
    phone: '',
    email: '',
    date: '',
    guests: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const isBg = locale === 'bg'
  const eventTypes = isBg ? EVENT_TYPES_BG : EVENT_TYPES_EN

  const labels = {
    title:       isBg ? 'Резервация'      : 'Reservation',
    eventType:   isBg ? 'Тип събитие'     : 'Event type',
    name:        isBg ? 'Имена'           : 'Name',
    phone:       isBg ? 'Телефон'         : 'Phone',
    email:       isBg ? 'Имейл'           : 'Email',
    date:        isBg ? 'Дата'            : 'Date',
    guests:      isBg ? 'Брой гости'      : 'Number of guests',
    message:     isBg ? 'Описание / Бележки' : 'Description / Notes',
    send:        isBg ? 'Изпрати'         : 'Send',
    sending:     isBg ? 'Изпращане...'    : 'Sending...',
    sent:        isBg ? 'Заявката е изпратена! Ще се свържем с вас скоро.' : 'Request sent! We will contact you shortly.',
    error:       isBg ? 'Грешка при изпращане. Опитайте отново.' : 'Error sending. Please try again.',
    required:    isBg ? 'Задължително поле' : 'Required field',
    selectType:  isBg ? '— Изберете тип —' : '— Select type —',
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale, venueName }),
      })
      if (res.ok) {
        setStatus('sent')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label={labels.title}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>

        <h2 className={styles.title}>{labels.title}</h2>
        <p className={styles.subtitle}>{venueName}</p>

        {status === 'sent' ? (
          <div className={styles.successMessage}>
            <span className={styles.successIcon}>✓</span>
            <p>{labels.sent}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Event type */}
            <div className={styles.field}>
              <label className={styles.label}>{labels.eventType}</label>
              <select
                name="eventType"
                value={form.eventType}
                onChange={handleChange}
                className={styles.select}
                required
              >
                <option value="">{labels.selectType}</option>
                {eventTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div className={styles.field}>
              <label className={styles.label}>{labels.name} *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={styles.input}
                required
                placeholder={labels.name}
              />
            </div>

            {/* Phone + Email row */}
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>{labels.phone} *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={styles.input}
                  required
                  placeholder="+359 ..."
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{labels.email}</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="email@..."
                />
              </div>
            </div>

            {/* Date + Guests row */}
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>{labels.date} *</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className={styles.input}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{labels.guests}</label>
                <input
                  type="number"
                  name="guests"
                  value={form.guests}
                  onChange={handleChange}
                  className={styles.input}
                  min="1"
                  max="500"
                  placeholder="2"
                />
              </div>
            </div>

            {/* Message */}
            <div className={styles.field}>
              <label className={styles.label}>{labels.message}</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className={styles.textarea}
                rows={3}
                placeholder="..."
              />
            </div>

            {status === 'error' && (
              <p className={styles.errorMsg}>{labels.error}</p>
            )}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={status === 'sending'}
            >
              {status === 'sending' ? labels.sending : labels.send}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
