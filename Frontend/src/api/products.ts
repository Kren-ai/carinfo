import apiClient from './axios'
import type {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
  ProductFilters,
} from '../types/product'

// GET /api/products  — returns all products, optionally filtered
export async function fetchProducts(filters?: ProductFilters): Promise<Product[]> {
  const params: Record<string, string | number> = {}

  if (filters?.product_name) params.product_name = filters.product_name
  if (filters?.product_type) params.product_type = filters.product_type

  // product_parent_id can be 0, null, or an actual ID — handle each case
  if (filters && 'product_parent_id' in filters && filters.product_parent_id !== '') {
    params.product_parent_id =
      filters.product_parent_id === null ? '' : (filters.product_parent_id as number)
  }

  const { data } = await apiClient.get<Product[]>('/products', { params })
  return data
}

// GET /api/products/:id  — returns one product by ID
export async function fetchProduct(id: number): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/products/${id}`)
  return data
}

// POST /api/products  — creates a new product
export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const { data } = await apiClient.post<Product>('/products', payload)
  return data
}

// PATCH /api/products/:id  — partially updates a product
export async function updateProduct(
  id: number,
  payload: UpdateProductPayload,
): Promise<Product> {
  const { data } = await apiClient.patch<Product>(`/products/${id}`, payload)
  return data
}

// DELETE /api/products/:id  — deletes a product
export async function deleteProduct(id: number): Promise<void> {
  await apiClient.delete(`/products/${id}`)
}
