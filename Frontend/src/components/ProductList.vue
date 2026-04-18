<script setup lang="ts">
/**
 * ProductList.vue
 *
 * Main page component. Shows:
 *   - Filter controls (name, type, parent filter)
 *   - "Add Product" button
 *   - A hierarchical list rendered via ProductItem
 *
 * Filtering works by hitting the backend with query params so the response
 * is always authoritative. After filter results are loaded, the store cache
 * is replaced with that subset, and ProductItem derives children from it.
 */
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useProductStore } from '../stores/productStore'
import ProductItem from './ProductItem.vue'
import ProductForm from './ProductForm.vue'
import type { ProductFilters } from '../types/product'

const store = useProductStore()
const $q = useQuasar()

// ─── Filter state ────────────────────────────────────────────────────────────
const filterName = ref('')
const filterType = ref('')
// '' = don't filter by parent; null = top-level only; number = specific parent
const filterParentId = ref<'' | null | number>('')

const parentFilterOptions = [
  { label: 'All products', value: '' },
  { label: 'Top-level only (no parent)', value: null },
]

// Derive unique product types from all products currently in the store.
// Prefixed with an "All types" option so the user can clear the filter.
const typeOptions = computed(() => {
  const unique = [...new Set(store.products.map((p) => p.product_type))].sort()
  return [{ label: 'All types', value: '' }, ...unique.map((t) => ({ label: t, value: t }))]
})

// ─── Dialog state ─────────────────────────────────────────────────────────────
const showCreateDialog = ref(false)

// ─── Load / reload ───────────────────────────────────────────────────────────
async function loadData(): Promise<void> {
  const filters: ProductFilters = {}
  if (filterName.value?.trim()) filters.product_name = filterName.value.trim()
  if (filterType.value?.trim()) filters.product_type = filterType.value.trim()
  if (filterParentId.value !== '') {
    filters.product_parent_id = filterParentId.value as number | null
  }

  try {
    await store.loadProducts(Object.keys(filters).length ? filters : undefined)
  } catch {
    $q.notify({ type: 'negative', message: 'Failed to load products.' })
  }
}

function clearFilters(): void {
  filterName.value = ''
  filterType.value = ''
  filterParentId.value = ''
  loadData()
}

// Load all products on mount
onMounted(() => loadData())
</script>

<template>
  <div class="q-pa-md">
    <!-- ── Header ─────────────────────────────────────────────────────────── -->
    <div class="row items-center q-mb-md">
      <div class="text-h5 text-weight-bold col">Products</div>
      <q-btn
        unelevated
        color="primary"
        icon="add"
        label="Add Product"
        @click="showCreateDialog = true"
      />
    </div>

    <!-- ── Filter bar ─────────────────────────────────────────────────────── -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row q-gutter-sm items-end">
          <q-input
            v-model="filterName"
            label="Search by name"
            outlined
            dense
            clearable
            style="min-width: 200px"
            @keyup.enter="loadData"
            @clear="loadData"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-select
            v-model="filterType"
            :options="typeOptions"
            emit-value
            map-options
            label="Filter by type"
            outlined
            dense
            clearable
            style="min-width: 180px"
            @update:model-value="loadData"
          >
            <template #prepend>
              <q-icon name="category" />
            </template>
          </q-select>

          <q-select
            v-model="filterParentId"
            :options="parentFilterOptions"
            emit-value
            map-options
            label="Parent filter"
            outlined
            dense
            style="min-width: 200px"
            @update:model-value="loadData"
          />

          <q-btn
            unelevated
            color="primary"
            icon="filter_alt"
            label="Apply"
            @click="loadData"
          />
          <q-btn
            flat
            color="grey"
            icon="clear"
            label="Clear"
            @click="clearFilters"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- ── Product list ───────────────────────────────────────────────────── -->
    <q-card flat bordered>
      <!-- Loading state -->
      <div v-if="store.loading" class="flex flex-center q-pa-xl">
        <q-spinner color="primary" size="40px" />
      </div>

      <!-- Empty state -->
      <div
        v-else-if="store.products.length === 0"
        class="flex flex-center column q-pa-xl text-grey"
      >
        <q-icon name="inventory_2" size="64px" color="grey-4" />
        <div class="text-body1 q-mt-sm">No products found.</div>
        <q-btn
          flat
          color="primary"
          label="Add the first product"
          class="q-mt-sm"
          @click="showCreateDialog = true"
        />
      </div>

      <!-- Hierarchical list: only root products are rendered here;
           each ProductItem recursively renders its own children -->
      <q-list v-else separator>
        <ProductItem
          v-for="product in store.rootProducts"
          :key="product.product_id"
          :product="product"
        />
      </q-list>

      <!-- Footer counts -->
      <q-separator v-if="store.products.length > 0" />
      <q-card-section v-if="store.products.length > 0" class="text-caption text-grey row q-gutter-x-md">
        <span>Total: {{ store.products.length }} products</span>
        <span>Top-level: {{ store.rootProducts.length }}</span>
      </q-card-section>
    </q-card>

    <!-- ── Create dialog ──────────────────────────────────────────────────── -->
    <ProductForm
      v-model="showCreateDialog"
      @saved="loadData"
    />
  </div>
</template>
