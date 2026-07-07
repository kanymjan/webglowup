export interface PostSummary {
  id: number
  slug: string
  title: string
  excerpt: string
  coverImageUrl: string | null
  createdAt: string
}

export interface PostDetail extends PostSummary {
  content: string
  published: boolean
}

export interface Lead {
  id: number
  name: string
  contact: string
  message: string | null
  createdAt: string
}

export interface LeadRequest {
  name: string
  contact: string
  message?: string
}

export interface PostRequest {
  slug: string
  title: string
  excerpt: string
  content: string
  coverImageUrl: string
  published: boolean
}
