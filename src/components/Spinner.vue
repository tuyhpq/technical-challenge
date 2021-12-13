<template>
  <template v-if="isLoading">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </template>
  <template v-else>
    <slot></slot>
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    isLoading: Boolean,
  },
});
</script>
