<script setup>
import { Search } from 'lucide-vue-next'
</script>
<template>
    <div class="relative ">
        <ul class="bg-black rounded-full shadow-sm flex item-center">
            <router-link to="/movies">
                <li class="py-2 px-4 text-sm text-gray-200 hover:bg-white/20 cursor-pointer hover:rounded-full">
                    Filmes
                </li>
            </router-link>
            <router-link to="/series">
                <li class="py-2 px-4 text-sm text-gray-200 hover:bg-white/20 cursor-pointer hover:rounded-full">Séries</li>
            </router-link>
            <router-link to="/people">
                <li class="py-2 px-4 text-sm text-gray-200 hover:bg-white/20 cursor-pointer hover:rounded-full">Artistas</li>
            </router-link>
            <li class="text-white py-2 px-4 cursor-pointer">
                <search class="size-5" />
            </li>
        </ul>
    </div>
</template>