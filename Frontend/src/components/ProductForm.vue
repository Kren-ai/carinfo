<script setup lang="ts">
/**
 * ProductForm.vue
 *
 * A modal dialog used for both creating a new product and editing an existing one.
 *
 * Props:
 *   - modelValue (v-model) : controls dialog visibility
 *   - product              : when provided, the form pre-fills for editing
 *   - parentId             : when provided, the new product is pre-assigned this parent
 *
 * Emits:
 *   - update:modelValue  : closes the dialog
 *   - saved              : emitted after a successful create or update
 */
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useProductStore } from '../stores/productStore'
import type { Product } from '../types/product'

// ─── Props & Emits ───────────────────────────────────────────────────────────
interface Props {
  modelValue: boolean
  product?: Product | null
  parentId?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  product: null,
  parentId: null,
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'saved'): void
}>()

// ─── Store & Quasar ──────────────────────────────────────────────────────────
const store = useProductStore()
const $q = useQuasar()

// ─── Form state ──────────────────────────────────────────────────────────────
const productName = ref('')
const productType = ref('')
const productParentId = ref<number | null>(null)

const isEditing = computed(() => !!props.product)
const dialogTitle = computed(() => (isEditing.value ? 'Edit Product' : 'Add Product'))

// Pre-fill the form whenever the dialog opens or the product prop changes
watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      if (props.product) {
        productName.value = props.product.product_name
        productType.value = props.product.product_type
        productParentId.value = props.product.product_parent_id
      } else {
        productName.value = ''
        productType.value = ''
        productParentId.value = props.parentId ?? null
      }
    }
  },
)

// ─── Parent options for the select ───────────────────────────────────────────
const parentOptions = computed(() => {
  const opts = store.products
    .filter(
      (p) =>
        // Cannot set itself as parent when editing
        (!isEditing.value || p.product_id !== props.product?.product_id),
    )
    .map((p) => ({ label: `${p.product_name} (${p.product_type})`, value: p.product_id }))

  return [{ label: '— No parent (top-level) —', value: null }, ...opts]
})

// ─── Submit ──────────────────────────────────────────────────────────────────
async function onSubmit(): Promise<void> {
  if (!productName.value.trim() || !productType.value.trim()) {
    $q.notify({ type: 'negative', message: 'Product name and type are required.' })
    return
  }

  try {
    if (isEditing.value && props.product) {
      await store.editProduct(props.product.product_id, {
        product_name: productName.value.trim(),
        product_type: productType.value.trim(),
        product_parent_id: productParentId.value,
      })
      $q.notify({ type: 'positive', message: 'Product updated successfully.' })
    } else {
      await store.addProduct({
        product_name: productName.value.trim(),
        product_type: productType.value.trim(),
        product_parent_id: productParentId.value,
      })
      $q.notify({ type: 'positive', message: 'Product created successfully.' })
    }
    emit('saved')
    emit('update:modelValue', false)
  } catch {
    $q.notify({ type: 'negative', message: 'An error occurred. Please try again.' })
  }
}

function onCancel(): void {
  emit('update:modelValue', false)
}
</script>

<template>
  <q-dialog :model-value="modelValue" persistent @update:model-value="emit('update:modelValue', $event)">
    <q-card style="min-width: 400px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ dialogTitle }}</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="onCancel" />
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <!-- Product Name -->
          <q-input
            v-model="productName"
            label="Product Name *"
            outlined
            dense
            :rules="[(v) => !!v || 'Product name is required']"
          />

          <!-- Product Type -->
          <q-input
            v-model="productType"
            label="Product Type *"
            outlined
            dense
            :rules="[(v) => !!v || 'Product type is required']"
          />

          <!-- Parent Product -->
          <q-select
            v-model="productParentId"
            :options="parentOptions"
            emit-value
            map-options
            label="Parent Product"
            outlined
            dense
            clearable
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="grey" @click="onCancel" />
        <q-btn
          unelevated
          :label="isEditing ? 'Save Changes' : 'Create'"
          color="primary"
          :loading="store.loading"
          @click="onSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
