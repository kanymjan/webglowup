import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'

export default function ShareButton() {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // буфер обмена недоступен — молча игнорируем
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-sm text-slate-300 backdrop-blur-xl transition-colors hover:border-violet-400/40 hover:text-white"
    >
      {copied ? <Check size={16} className="text-violet-300" /> : <Share2 size={16} />}
      {copied ? 'Ссылка скопирована' : 'Поделиться'}
    </button>
  )
}
