<script setup>
import TheNavigation from './TheNavigation.vue'
</script>
<template>
    <div class="w-full relative min-h-screen background-color-theme">
        <div class="max-w-7xl mx-auto">
            <the-navigation />
            <slot></slot>
        </div>
    </div>
</template>