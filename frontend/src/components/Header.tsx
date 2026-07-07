import { motion } from 'framer-motion'
import { Link, NavLink } from 'react-router-dom'
import { BRAND_NAME } from '../config/socials'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `relative text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-violet-400 after:transition-all after:duration-300 hover:after:w-full ${
    isActive ? 'text-white after:w-full' : 'text-slate-400 hover:text-white'
  }`

export default function Header() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-20 border-b border-white/10 bg-white/5 shadow-lg shadow-black/10 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="text-lg font-semibold tracking-tight text-white">
          {BRAND_NAME}
        </Link>
        <nav className="flex items-center gap-8">
          <NavLink to="/" end className={navLinkClass}>
            Главная
          </NavLink>
          <NavLink to="/blog" className={navLinkClass}>
            Блог
          </NavLink>
          <a
            href="#contact"
            className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-transform hover:scale-105"
          >
            Оставить заявку
          </a>
        </nav>
      </div>
    </motion.header>
  )
}
