<script setup lang="ts">
/**
 * ProductItem.vue
 *
 * Displays a single product row inside the QTable.
 * Shows an expand/collapse button when the product has children.
 * Expands inline to show child products (recursively rendered via ProductItem).
 *
 * Props:
 *   - product  : the Product to display
 *   - depth    : nesting level (used for left indent)
 */
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useProductStore } from '../stores/productStore'
import ProductForm from './ProductForm.vue'
import type { Product } from '../types/product'

interface Props {
  product: Product
  depth?: number
}

const props = withDefaults(defineProps<Props>(), { depth: 0 })

const store = useProductStore()
const $q = useQuasar()

// ─── Local state ─────────────────────────────────────────────────────────────
const expanded = ref(false)
const showEditDialog = ref(false)
const showAddChildDialog = ref(false)

// ─── Derived ─────────────────────────────────────────────────────────────────
const children = computed(() => store.childrenOf(props.product.product_id))
const hasChildren = computed(() => children.value.length > 0)
const indentPx = computed(() => props.depth * 24)

// ─── Actions ─────────────────────────────────────────────────────────────────
function confirmDelete(): void {
  $q.dialog({
    title: 'Delete Product',
    message: `Delete "${props.product.product_name}"? This cannot be undone.`,
    ok: { label: 'Delete', color: 'negative', unelevated: true },
    cancel: { label: 'Cancel', flat: true },
    persistent: true,
  }).onOk(async () => {
    try {
      await store.removeProduct(props.product.product_id)
      $q.notify({ type: 'positive', message: 'Product deleted.' })
    } catch {
      $q.notify({ type: 'negative', message: 'Failed to delete product.' })
    }
  })
}
</script>

<template>
  <!-- Main row -->
  <q-item
    :style="{ paddingLeft: `${indentPx + 16}px` }"
    class="product-item"
    dense
  >
    <!-- Expand/collapse toggle -->
    <q-item-section avatar style="min-width: 32px">
      <q-btn
        v-if="hasChildren"
        :icon="expanded ? 'expand_less' : 'expand_more'"
        flat
        round
        dense
        size="sm"
        @click="expanded = !expanded"
      />
      <q-icon v-else name="fiber_manual_record" size="8px" color="grey-5" />
    </q-item-section>

    <!-- Name + type -->
    <q-item-section>
      <q-item-label class="text-weight-medium">{{ product.product_name }}</q-item-label>
      <q-item-label caption>{{ product.product_type }}</q-item-label>
    </q-item-section>

    <!-- Children badge -->
    <q-item-section side>
      <q-badge
        v-if="hasChildren"
        color="blue-2"
        text-color="blue-9"
        :label="`${children.length} child${children.length > 1 ? 'ren' : ''}`"
      />
    </q-item-section>

    <!-- Action buttons -->
    <q-item-section side>
      <div class="row no-wrap q-gutter-xs">
        <!-- Add child -->
        <q-btn
          icon="add"
          flat
          round
          dense
          size="sm"
          color="primary"
          title="Add child product"
          @click="showAddChildDialog = true"
        />
        <!-- Edit -->
        <q-btn
          icon="edit"
          flat
          round
          dense
          size="sm"
          color="secondary"
          title="Edit product"
          @click="showEditDialog = true"
        />
        <!-- Delete -->
        <q-btn
          icon="delete"
          flat
          round
          dense
          size="sm"
          color="negative"
          title="Delete product"
          @click="confirmDelete"
        />
      </div>
    </q-item-section>
  </q-item>

  <!-- Separator -->
  <q-separator inset />

  <!-- Children (recursive) -->
  <template v-if="expanded && hasChildren">
    <ProductItem
      v-for="child in children"
      :key="child.product_id"
      :product="child"
      :depth="depth + 1"
    />
  </template>

  <!-- Edit dialog -->
  <ProductForm
    v-model="showEditDialog"
    :product="product"
    @saved="showEditDialog = false"
  />

  <!-- Add child dialog -->
  <ProductForm
    v-model="showAddChildDialog"
    :parent-id="product.product_id"
    @saved="showAddChildDialog = false"
  />
</template>

<style scoped>
.product-item {
  transition: background-color 0.15s;
}
.product-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>
