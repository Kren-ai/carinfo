import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, CreateProductPayload, UpdateProductPayload, ProductFilters } from '../types/product'
import {
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../api/products'

export const useProductStore = defineStore('products', () => {
  // ─── State ────────────────────────────────────────────────────────────────
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ─── Getters ──────────────────────────────────────────────────────────────

  // Returns a flat list of all top-level products (no parent)
  const rootProducts = computed(() =>
    products.value.filter((p) => p.product_parent_id === null),
  )

  // Returns children of a given product_id from the flat list
  function childrenOf(parentId: number): Product[] {
    return products.value.filter((p) => p.product_parent_id === parentId)
  }

  // Returns a product by its ID from the cached list
  function findById(id: number): Product | undefined {
    return products.value.find((p) => p.product_id === id)
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  async function loadProducts(filters?: ProductFilters): Promise<void> {
    loading.value = true
    error.value = null
    try {
      products.value = await fetchProducts(filters)
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function loadProduct(id: number): Promise<Product> {
    loading.value = true
    error.value = null
    try {
      const product = await fetchProduct(id)
      // Merge into the local cache
      const idx = products.value.findIndex((p) => p.product_id === id)
      if (idx !== -1) {
        products.value[idx] = product
      } else {
        products.value.push(product)
      }
      return product
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function addProduct(payload: CreateProductPayload): Promise<Product> {
    loading.value = true
    error.value = null
    try {
      const created = await createProduct(payload)
      products.value.push(created)
      return created
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function editProduct(id: number, payload: UpdateProductPayload): Promise<Product> {
    loading.value = true
    error.value = null
    try {
      const updated = await updateProduct(id, payload)
      const idx = products.value.findIndex((p) => p.product_id === id)
      if (idx !== -1) products.value[idx] = updated
      return updated
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function removeProduct(id: number): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await deleteProduct(id)
      products.value = products.value.filter((p) => p.product_id !== id)
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    // state
    products,
    loading,
    error,
    // getters
    rootProducts,
    childrenOf,
    findById,
    // actions
    loadProducts,
    loadProduct,
    addProduct,
    editProduct,
    removeProduct,
  }
})
