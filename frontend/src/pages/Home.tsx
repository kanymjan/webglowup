import { motion } from 'framer-motion'
import { Code2, PenTool, Smartphone } from 'lucide-react'
import Faq from '../components/Faq'
import HeroMockup from '../components/HeroMockup'
import LeadForm from '../components/LeadForm'
import LevelRing from '../components/LevelRing'
import { BRAND_NAME } from '../config/socials'

const services = [
  {
    index: '01',
    icon: Code2,
    title: 'Сайты',
    description: 'Лендинги, корпоративные и интернет-магазины — быстрые, адаптивные, с продуманной структурой.',
  },
  {
    index: '02',
    icon: Smartphone,
    title: 'Приложения',
    description: 'Мобильные и веб-приложения под ваши задачи, от идеи до релиза.',
  },
  {
    index: '03',
    icon: PenTool,
    title: 'Дизайн',
    description: 'UI/UX-дизайн и доработка существующих сайтов и приложений — сделаю красиво и удобно.',
  },
]

const steps = [
  { title: 'Заявка', description: 'Оставляете заявку или пишете в мессенджер — обсуждаем задачу.' },
  { title: 'Оценка', description: 'Присылаю сроки, стоимость и план работ.' },
  { title: 'Разработка', description: 'Делаю сайт/приложение/дизайн с промежуточными показами.' },
  { title: 'Запуск', description: 'Финальные правки, запуск и поддержка после сдачи.' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

export default function Home() {
  return (
    <div className="flex flex-col overflow-hidden">
      <section className="relative">
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-violet-600/25 blur-[100px] animate-float-slow" />
        <div className="pointer-events-none absolute top-40 -right-32 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-[100px] animate-float-slower" />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-28 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col items-start gap-6 text-left">
            <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-medium text-violet-200 shadow-lg shadow-black/20 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              {BRAND_NAME}
            </span>
            <h1 className="text-shadow-soft text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Делаю сайты, приложения и дизайн, которые приводят клиентов
            </h1>
            <p className="text-shadow-soft max-w-xl text-lg text-slate-300">
              Разработка сайтов и приложений, UI/UX-дизайн и доработка существующих проектов.
              Расскажите о задаче — предложу решение и сроки.
            </p>
            <a
              href="#contact"
              className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-7 py-3 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-transform hover:scale-105"
            >
              Оставить заявку
            </a>
          </div>

          <HeroMockup />
        </div>
      </section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.12 }}
        className="relative mx-auto grid max-w-6xl gap-6 px-6 py-16 sm:grid-cols-3"
      >
        {services.map(({ index, icon: Icon, title, description }, i) => (
          <motion.div
            key={title}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -6 }}
            className="group flex flex-col gap-4 rounded-2xl border border-white/15 bg-white/[0.04] p-6 shadow-xl shadow-black/20 backdrop-blur-xl transition-colors hover:border-violet-400/40 hover:bg-white/[0.07]"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-violet-300 backdrop-blur-xl transition-colors group-hover:text-violet-200">
                <Icon size={20} />
              </div>
              <LevelRing value={i + 1} total={services.length} size={34}>
                {index}
              </LevelRing>
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-slate-400">{description}</p>
          </motion.div>
        ))}
      </motion.section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-shadow-soft mb-10 text-center text-2xl font-semibold text-white"
        >
          Как мы работаем
        </motion.h2>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.12 }}
          className="relative rounded-3xl border border-white/15 bg-white/[0.04] p-8 shadow-xl shadow-black/20 backdrop-blur-xl sm:p-10"
        >
          <div className="pointer-events-none absolute left-14 right-14 top-[68px] hidden h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent sm:block" />
          <div className="grid gap-8 sm:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div key={step.title} variants={fadeUp} transition={{ duration: 0.5 }} className="relative flex flex-col gap-3">
                <LevelRing value={i + 1} total={steps.length} size={44}>
                  {String(i + 1).padStart(2, '0')}
                </LevelRing>
                <h3 className="font-medium text-white">{step.title}</h3>
                <p className="text-sm text-slate-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-shadow-soft mb-10 text-center text-2xl font-semibold text-white"
        >
          Частые вопросы
        </motion.h2>
        <Faq />
      </section>

      <section id="contact" className="relative mx-auto w-full max-w-lg px-6 py-20">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.1),transparent_70%)]" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-white/15 bg-white/[0.04] p-8 shadow-2xl shadow-black/40 backdrop-blur-xl"
        >
          <h2 className="mb-2 text-center text-2xl font-semibold text-white">Оставить заявку</h2>
          <p className="mb-8 text-center text-sm text-slate-400">
            Заполните форму, и я свяжусь с вами в ближайшее время.
          </p>
          <LeadForm />
        </motion.div>
      </section>
    </div>
  )
}
