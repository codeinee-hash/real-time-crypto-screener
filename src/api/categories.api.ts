import { fetcher } from '@/lib/coingecko.api'

export async function getCategories(): Promise<Category[] | null> {
  try {
    const response = await fetcher<Category[]>('/coins/categories')
    return response
  } catch (e) {
    console.error('Error fetching categories: ', e)
    return null
  }
}
