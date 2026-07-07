import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { PostSummary } from '../api/types'

export default function PostCard({ post }: { post: PostSummary }) {
  const date = new Date(post.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -4 }}>
      <Link
        to={`/blog/${post.slug}`}
        className="flex flex-col gap-2 rounded-2xl border border-white/15 bg-white/[0.04] p-6 shadow-xl shadow-black/20 backdrop-blur-xl transition-colors hover:border-violet-400/40 hover:bg-white/[0.07]"
      >
        <span className="text-xs font-medium uppercase tracking-wide text-violet-400">{date}</span>
        <h3 className="text-lg font-semibold text-white">{post.title}</h3>
        <p className="text-sm text-slate-400">{post.excerpt}</p>
      </Link>
    </motion.div>
  )
}
