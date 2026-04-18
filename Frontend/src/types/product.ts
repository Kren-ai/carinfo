// Represents a single product returned from the API
export interface Product {
  product_id: number
  product_name: string
  product_type: string
  product_parent_id: number | null
  created_at: string
  updated_at: string
  children?: Product[]
}

// Payload for creating a new product (POST /api/products)
export interface CreateProductPayload {
  product_name: string
  product_type: string
  product_parent_id: number | null
}

// Payload for updating a product (PUT/PATCH /api/products/:id)
// All fields are optional to support partial PATCH updates
export interface UpdateProductPayload {
  product_name?: string
  product_type?: string
  product_parent_id?: number | null
}

// Query parameters for filtering the product list
export interface ProductFilters {
  product_name?: string
  product_type?: string
  product_parent_id?: number | null | ''
}
