import type { Lead, LeadRequest, PostDetail, PostRequest, PostSummary } from './types'

const API_BASE = import.meta.env.VITE_API_URL ?? ''
const ADMIN_KEY_STORAGE = 'webglowup_admin_key'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!res.ok) {
    let message = `Ошибка запроса (${res.status})`
    try {
      const body = await res.json()
      message = body.message || body.error || message
    } catch {
      // тело не JSON — оставляем сообщение по умолчанию
    }
    throw new ApiError(res.status, message)
  }

  const text = await res.text()
  if (!text) {
    return undefined as T
  }
  return JSON.parse(text) as T
}

function adminHeaders(): HeadersInit {
  return { 'X-Admin-Key': getAdminKey() ?? '' }
}

export function getAdminKey(): string | null {
  return localStorage.getItem(ADMIN_KEY_STORAGE)
}

export function setAdminKey(key: string) {
  localStorage.setItem(ADMIN_KEY_STORAGE, key)
}

export function clearAdminKey() {
  localStorage.removeItem(ADMIN_KEY_STORAGE)
}

export function submitLead(lead: LeadRequest): Promise<void> {
  return request<void>('/api/leads', {
    method: 'POST',
    body: JSON.stringify(lead),
  })
}

export function fetchPosts(): Promise<PostSummary[]> {
  return request<PostSummary[]>('/api/posts')
}

export function fetchPostBySlug(slug: string): Promise<PostDetail> {
  return request<PostDetail>(`/api/posts/${encodeURIComponent(slug)}`)
}

export function adminFetchLeads(): Promise<Lead[]> {
  return request<Lead[]>('/api/admin/leads', { headers: adminHeaders() })
}

export function adminFetchPosts(): Promise<PostDetail[]> {
  return request<PostDetail[]>('/api/admin/posts', { headers: adminHeaders() })
}

export function adminCreatePost(post: PostRequest): Promise<PostDetail> {
  return request<PostDetail>('/api/admin/posts', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(post),
  })
}

export function adminUpdatePost(id: number, post: PostRequest): Promise<PostDetail> {
  return request<PostDetail>(`/api/admin/posts/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(post),
  })
}

export function adminDeletePost(id: number): Promise<void> {
  return request<void>(`/api/admin/posts/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  })
}
