import { useState } from 'react'
import { motion } from 'framer-motion'
import { ApiError, submitLead } from '../api/client'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const inputClass =
  'rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-violet-400/50 focus:ring-1 focus:ring-violet-400/50'

export default function LeadForm() {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      await submitLead({ name, contact, message: message || undefined })
      setStatus('success')
      setName('')
      setContact('')
      setMessage('')
    } catch (err) {
      setStatus('error')
      setError(err instanceof ApiError ? err.message : 'Не удалось отправить заявку, попробуйте ещё раз')
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-violet-400/30 bg-violet-500/10 p-6 text-center text-violet-200"
      >
        Спасибо! Заявка отправлена, я скоро свяжусь с вами.
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-slate-300">
          Имя
        </label>
        <input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="Как к вам обращаться"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="lead-contact" className="text-sm font-medium text-slate-300">
          Контакт
        </label>
        <input
          id="lead-contact"
          required
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className={inputClass}
          placeholder="Telegram, WhatsApp, телефон или email"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm font-medium text-slate-300">
          Расскажите о проекте
        </label>
        <textarea
          id="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputClass}
          placeholder="Что нужно сделать: сайт, приложение, дизайн..."
        />
      </div>
      {status === 'error' && <p className="text-sm text-red-400">{error}</p>}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={status === 'submitting'}
        className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-violet-500/25 disabled:opacity-60"
      >
        {status === 'submitting' ? 'Отправка...' : 'Оставить заявку'}
      </motion.button>
    </form>
  )
}
