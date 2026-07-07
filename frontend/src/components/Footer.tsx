import { motion } from 'framer-motion'
import { Mail, Send } from 'lucide-react'
import InstagramIcon from './icons/InstagramIcon'
import { BRAND_NAME, SOCIALS } from '../config/socials'

const links = [
  { href: SOCIALS.telegram, label: 'Telegram', icon: Send },
  { href: SOCIALS.instagram, label: 'Instagram', icon: InstagramIcon },
  { href: SOCIALS.email, label: 'Email', icon: Mail },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-white/[0.02] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-14 text-center">
        <p className="text-sm font-medium text-white">{BRAND_NAME}</p>
        <p className="max-w-md text-sm text-slate-400">
          Разработка сайтов, приложений и дизайн под ключ. Пишите — обсудим ваш проект.
        </p>
        <div className="flex gap-3">
          {links.map(({ href, label, icon: Icon }, i) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}
              aria-label={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -3 }}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-slate-300 backdrop-blur-xl transition-colors hover:border-violet-400/50 hover:text-violet-300 hover:shadow-[0_0_20px_rgba(167,139,250,0.35)]"
            >
              <Icon size={18} />
            </motion.a>
          ))}
        </div>
        <p className="text-xs text-slate-500">© {new Date().getFullYear()} {BRAND_NAME}</p>
      </div>
    </footer>
  )
}
