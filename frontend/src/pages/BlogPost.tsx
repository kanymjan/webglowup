import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { ApiError, fetchPostBySlug, fetchPosts } from '../api/client'
import PostCard from '../components/PostCard'
import ShareButton from '../components/ShareButton'
import { estimateReadingTime } from '../utils/readingTime'
import type { PostDetail, PostSummary } from '../api/types'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<PostDetail | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<PostSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setRelatedPosts([])
    fetchPostBySlug(slug)
      .then(setPost)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Статья не найдена'))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!post) return
    fetchPosts()
      .then((posts) => setRelatedPosts(posts.filter((p) => p.slug !== post.slug).slice(0, 3)))
      .catch(() => setRelatedPosts([]))
  }, [post])

  return (
    <div className="min-h-[70vh]">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link to="/blog" className="text-shadow-soft text-sm font-medium text-violet-300 hover:underline">
          ← Все статьи
        </Link>

        {loading && <p className="text-shadow-soft mt-8 text-sm text-slate-300">Загрузка...</p>}
        {error && <p className="text-shadow-soft mt-8 text-sm text-red-400">{error}</p>}

        {post && (
          <article className="mt-6 rounded-3xl border border-white/15 bg-white/[0.04] p-6 shadow-xl shadow-black/20 backdrop-blur-xl sm:p-10">
            <h1 className="mb-2 text-3xl font-semibold text-white">{post.title}</h1>
            <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span>
                {new Date(post.createdAt).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <span>·</span>
              <span>{estimateReadingTime(post.content)} мин чтения</span>
              <span className="ml-auto">
                <ShareButton />
              </span>
            </div>
            <div className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-violet-400">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </article>
        )}

        {relatedPosts.length > 0 && (
          <div className="mt-16 border-t border-white/10 pt-10">
            <h2 className="text-shadow-soft mb-6 text-lg font-semibold text-white">Похожие статьи</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {relatedPosts.map((related) => (
                <PostCard key={related.id} post={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
