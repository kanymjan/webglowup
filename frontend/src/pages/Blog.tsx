import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { ApiError, fetchPosts } from '../api/client'
import PostCard from '../components/PostCard'
import type { PostSummary } from '../api/types'

export default function Blog() {
  const [posts, setPosts] = useState<PostSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    fetchPosts()
      .then(setPosts)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Не удалось загрузить статьи'))
      .finally(() => setLoading(false))
  }, [])

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return posts
    return posts.filter(
      (post) => post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q),
    )
  }, [posts, query])

  return (
    <div className="min-h-[70vh]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-shadow-soft mb-2 text-3xl font-semibold text-white">Блог</h1>
        <p className="text-shadow-soft mb-8 text-slate-300">Статьи о разработке сайтов, приложений и дизайне.</p>

        {posts.length > 0 && (
          <div className="relative mb-10 max-w-sm">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по статьям..."
              className="w-full rounded-full border border-white/15 bg-white/[0.05] py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 outline-none backdrop-blur-xl transition-colors focus:border-violet-400/50 focus:ring-1 focus:ring-violet-400/50"
            />
          </div>
        )}

        {loading && <p className="text-shadow-soft text-sm text-slate-300">Загрузка...</p>}
        {error && <p className="text-shadow-soft text-sm text-red-400">{error}</p>}
        {!loading && !error && posts.length === 0 && (
          <p className="text-shadow-soft text-sm text-slate-300">Пока нет статей — загляните позже.</p>
        )}
        {!loading && !error && posts.length > 0 && filteredPosts.length === 0 && (
          <p className="text-shadow-soft text-sm text-slate-300">Ничего не найдено по запросу «{query}».</p>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}
