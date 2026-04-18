<script setup lang="ts">
import ProductList from './components/ProductList.vue'
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-icon name="directions_car" class="q-mr-sm" />
          CarInfo
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <ProductList />
      </q-page>
    </q-page-container>
  </q-layout>
</template>
