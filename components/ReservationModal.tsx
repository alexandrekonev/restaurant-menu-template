'use client'

import React, { useState, useRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import type { Locale } from '@/lib/i18n'
import styles from './ReservationModal.module.css'

const EVENT_TYPES_BG = ['Рожден ден', 'Годишнина', 'Бизнес събитие', 'Приятелска вечеря', 'Друго']
const EVENT_TYPES_EN = ['Birthday', 'Anniversary', 'Business event', 'Friends dinner', 'Other']

interface Props {
  locale: Locale
  venueName: string
  onClose: () => void
}

type FieldErrors = Partial<Record<string, string>>

function validatePhone(v: string) {
  const cleaned = v.replace(/[\s\-()+]/g, '')
  return /^\d{8,}$/.test(cleaned)
}

function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
}

function toIsoDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Custom input for react-datepicker — forwards the ref so the
// library can position its calendar, keeps our name/class/styling.
const DateInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => (
  <input {...props} ref={ref} name="date" readOnly />
))
DateInput.displayName = 'DateInput'

export default function ReservationModal({ locale, venueName, onClose }: Props) {
  const [form, setForm] = useState({
    eventType: '',
    name: '',
    phone: '',
    email: '',
    date: '',      // ISO string YYYY-MM-DD
    guests: '',
    message: '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  const isBg = locale === 'bg'
  const eventTypes = isBg ? EVENT_TYPES_BG : EVENT_TYPES_EN

  const labels = {
    title:          isBg ? 'Резервация'              : 'Reservation',
    eventType:      isBg ? 'Тип събитие'             : 'Event type',
    name:           isBg ? 'Имена'                   : 'Name',
    phone:          isBg ? 'Телефон'                 : 'Phone',
    email:          isBg ? 'Имейл'                   : 'Email',
    date:           isBg ? 'Дата'                    : 'Date',
    datePlaceholder:isBg ? 'дд.мм.гггг'              : 'dd.mm.yyyy',
    guests:         isBg ? 'Брой гости'              : 'Number of guests',
    message:        isBg ? 'Описание / Бележки'      : 'Description / Notes',
    send:           isBg ? 'Изпрати'                 : 'Send',
    sending:        isBg ? 'Изпращане...'            : 'Sending...',
    sent:           isBg ? 'Заявката е изпратена! Ще се свържем с вас скоро.' : 'Request sent! We will contact you shortly.',
    error:          isBg ? 'Грешка при изпращане. Опитайте отново.'           : 'Error sending. Please try again.',
    selectType:     isBg ? '— Изберете тип —'        : '— Select type —',
    errGuests:      isBg ? 'Моля въведете брой гости'                         : 'Please enter number of guests',
    errGuestsRange: isBg ? 'Моля въведете валиден брой от 1 до 99 или позвънете' : 'Please enter a valid number from 1 to 99 or call us',
    errEmail:       isBg ? 'Моля въведете валиден имейл адрес'                : 'Please enter a valid email address',
    errPhone:       isBg ? 'Моля въведете валиден телефонен номер'            : 'Please enter a valid phone number',
    errName:        isBg ? 'Моля въведете имена'                              : 'Please enter your name',
    errDate:        isBg ? 'Моля изберете дата'                               : 'Please select a date',
  }

  const clearError = (name: string) => {
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    clearError(name)
  }

  const handleDateChange = (d: Date | null) => {
    setForm(f => ({ ...f, date: d ? toIsoDate(d) : '' }))
    clearError('date')
  }

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {}
    if (!form.name.trim())                                errs.name   = labels.errName
    if (!form.phone.trim() || !validatePhone(form.phone)) errs.phone  = labels.errPhone
    if (!form.email.trim() || !validateEmail(form.email)) errs.email  = labels.errEmail
    if (!form.date)                                       errs.date   = labels.errDate
    if (!form.guests.trim()) {
      errs.guests = labels.errGuests
    } else {
      const n = Number(form.guests)
      if (!Number.isInteger(n) || n < 1 || n > 99)       errs.guests = labels.errGuestsRange
    }
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      const firstKey = Object.keys(errs)[0]
      const el = formRef.current?.querySelector(`[name="${firstKey}"]`) as HTMLElement | null
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el?.focus()
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale, venueName }),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const inputClass = (name: string) =>
    [styles.input, errors[name] ? styles.inputError : ''].filter(Boolean).join(' ')

  const selectedDate = form.date ? new Date(form.date + 'T12:00:00') : null

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
          <form ref={formRef} onSubmit={handleSubmit} className={styles.form} noValidate>

            {/* Event type */}
            <div className={styles.field}>
              <label className={styles.label}>{labels.eventType}</label>
              <div className={styles.selectWrapper}>
                <select
                  name="eventType"
                  value={form.eventType}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">{labels.selectType}</option>
                  {eventTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Name */}
            <div className={styles.field}>
              <label className={styles.label}>{labels.name} *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={inputClass('name')}
                placeholder={labels.name}
                autoComplete="name"
              />
              {errors.name && <p className={styles.fieldError}>{errors.name}</p>}
            </div>

            {/* Phone + Email */}
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>{labels.phone} *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputClass('phone')}
                  placeholder="+359 ..."
                  autoComplete="tel"
                  inputMode="tel"
                />
                {errors.phone && <p className={styles.fieldError}>{errors.phone}</p>}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{labels.email} *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass('email')}
                  placeholder="email@..."
                  autoComplete="email"
                  inputMode="email"
                />
                {errors.email && <p className={styles.fieldError}>{errors.email}</p>}
              </div>
            </div>

            {/* Date + Guests */}
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>{labels.date} *</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  dateFormat="dd.MM.yyyy"
                  placeholderText={labels.datePlaceholder}
                  customInput={<DateInput className={inputClass('date')} />}
                  wrapperClassName={styles.datePickerWrapper}
                  popperProps={{ strategy: 'fixed' }}
                  popperPlacement="bottom-start"
                  calendarClassName={styles.datePicker}
                />
                {errors.date && <p className={styles.fieldError}>{errors.date}</p>}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{labels.guests} *</label>
                <input
                  type="number"
                  name="guests"
                  value={form.guests}
                  onChange={handleChange}
                  className={inputClass('guests')}
                  min="1"
                  max="99"
                  placeholder={labels.guests}
                  inputMode="numeric"
                />
                {errors.guests && <p className={styles.fieldError}>{errors.guests}</p>}
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

            {status === 'error' && <p className={styles.errorMsg}>{labels.error}</p>}

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
