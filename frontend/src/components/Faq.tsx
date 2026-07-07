import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'Сколько стоит сайт или приложение?',
    a: 'Зависит от объёма и сложности задачи. После заявки я задам пару уточняющих вопросов и пришлю точную стоимость и сроки — без скрытых доплат.',
  },
  {
    q: 'Сколько времени занимает разработка?',
    a: 'Простой лендинг — от недели, сайт с блогом и админкой — от двух-трёх недель, приложение — от месяца. Точный срок зависит от объёма функций.',
  },
  {
    q: 'У меня уже есть сайт, нужна только доработка или дизайн — вы этим занимаетесь?',
    a: 'Да, беру задачи и на доработку существующих сайтов/приложений, и на отдельный UI/UX-дизайн без разработки.',
  },
  {
    q: 'Как проходит оплата?',
    a: 'Обычно предоплата 30–50% перед стартом и остаток по завершении работ. Для крупных проектов разбиваем на этапы.',
  },
  {
    q: 'Что после запуска — поддержка есть?',
    a: 'Да, после сдачи проекта готов вносить правки и сопровождать сайт/приложение на регулярной основе — обсуждаем формат отдельно.',
  },
]

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="flex flex-col gap-3">
      {faqs.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <motion.div
            key={item.q}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] shadow-lg shadow-black/20 backdrop-blur-xl"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-medium text-white">{item.q}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="shrink-0 text-violet-300"
              >
                <ChevronDown size={18} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <p className="px-6 pb-4 text-sm text-slate-400">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
