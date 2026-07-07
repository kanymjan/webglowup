import { useEffect, useState } from 'react'
import {
  ApiError,
  adminCreatePost,
  adminDeletePost,
  adminFetchLeads,
  adminFetchPosts,
  adminUpdatePost,
  clearAdminKey,
  getAdminKey,
  setAdminKey,
} from '../api/client'
import type { Lead, PostDetail, PostRequest } from '../api/types'

const emptyForm: PostRequest = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  coverImageUrl: '',
  published: true,
}

const inputClass =
  'rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-violet-400/50 focus:ring-1 focus:ring-violet-400/50'

export default function Admin() {
  const [key, setKey] = useState(getAdminKey() ?? '')
  const [unlocked, setUnlocked] = useState(!!getAdminKey())
  const [leads, setLeads] = useState<Lead[]>([])
  const [posts, setPosts] = useState<PostDetail[]>([])
  const [form, setForm] = useState<PostRequest>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  async function loadData() {
    setError('')
    try {
      const [leadsData, postsData] = await Promise.all([adminFetchLeads(), adminFetchPosts()])
      setLeads(leadsData)
      setPosts(postsData)
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearAdminKey()
        setUnlocked(false)
        setError('Неверный ключ доступа')
      } else {
        setError('Не удалось загрузить данные')
      }
    }
  }

  useEffect(() => {
    if (unlocked) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked])

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault()
    setAdminKey(key)
    setUnlocked(true)
  }

  function startEdit(post: PostDetail) {
    setEditingId(post.id)
    setForm({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImageUrl: post.coverImageUrl ?? '',
      published: post.published,
    })
  }

  function resetForm() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        await adminUpdatePost(editingId, form)
      } else {
        await adminCreatePost(form)
      }
      resetForm()
      loadData()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось сохранить пост')
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Удалить пост?')) return
    try {
      await adminDeletePost(id)
      loadData()
    } catch {
      setError('Не удалось удалить пост')
    }
  }

  if (!unlocked) {
    return (
      <div className="min-h-[70vh]">
        <div className="mx-auto flex max-w-sm flex-col gap-4 px-6 py-24">
          <h1 className="text-xl font-semibold text-white">Вход в админку</h1>
          <form onSubmit={handleUnlock} className="flex flex-col gap-3">
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Admin key"
              className={inputClass}
            />
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/25"
            >
              Войти
            </button>
          </form>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh]">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">Админка</h1>
          <button
            onClick={() => {
              clearAdminKey()
              setUnlocked(false)
            }}
            className="text-sm text-slate-400 hover:text-white hover:underline"
          >
            Выйти
          </button>
        </div>

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-white">Заявки ({leads.length})</h2>
          <div className="flex flex-col gap-3">
            {leads.map((lead) => (
              <div key={lead.id} className="rounded-xl border border-white/15 bg-white/[0.04] backdrop-blur-xl p-4 text-sm">
                <p className="font-medium text-white">{lead.name} — {lead.contact}</p>
                {lead.message && <p className="mt-1 text-slate-400">{lead.message}</p>}
                <p className="mt-1 text-xs text-slate-500">{new Date(lead.createdAt).toLocaleString('ru-RU')}</p>
              </div>
            ))}
            {leads.length === 0 && <p className="text-sm text-slate-500">Пока нет заявок</p>}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">Посты блога</h2>
          <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-3 rounded-xl border border-white/15 bg-white/[0.04] backdrop-blur-xl p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                required
                placeholder="slug (например, kak-my-rabotaem)"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className={inputClass}
              />
              <input
                required
                placeholder="Заголовок"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass}
              />
            </div>
            <input
              placeholder="Краткое описание (excerpt)"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className={inputClass}
            />
            <input
              placeholder="URL обложки (необязательно)"
              value={form.coverImageUrl}
              onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
              className={inputClass}
            />
            <textarea
              required
              rows={8}
              placeholder="Текст поста в Markdown"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className={`${inputClass} font-mono`}
            />
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              Опубликовать
            </label>
            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/25"
              >
                {editingId ? 'Сохранить изменения' : 'Создать пост'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="text-sm text-slate-400 hover:text-white hover:underline">
                  Отменить
                </button>
              )}
            </div>
          </form>

          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center justify-between rounded-xl border border-white/15 bg-white/[0.04] backdrop-blur-xl p-4">
                <div>
                  <p className="font-medium text-white">
                    {post.title} {!post.published && <span className="text-xs text-amber-400">(черновик)</span>}
                  </p>
                  <p className="text-xs text-slate-500">/{post.slug}</p>
                </div>
                <div className="flex gap-3 text-sm">
                  <button onClick={() => startEdit(post)} className="text-violet-400 hover:underline">
                    Редактировать
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="text-red-400 hover:underline">
                    Удалить
                  </button>
                </div>
              </div>
            ))}
            {posts.length === 0 && <p className="text-sm text-slate-500">Пока нет постов</p>}
          </div>
        </section>
      </div>
    </div>
  )
}
