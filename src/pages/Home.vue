<script setup>
import Container from '../components/Container.vue'
import  { useRoute } from 'vue-router'
import { useMoviesStore } from '../store/movies'
import { useMovies } from '../composables'
import { onMounted } from 'vue'

const route = useRoute()
const moviesStore = useMoviesStore()
const { 
    getTrending, 
    getResourceName, 
    toLocalDate, 
    convertToSlug, 
    getMovies 
} = useMovies()

const getResource = () => {
    if(route.name === 'home'){
        return moviesStore.movies
    }
    return moviesStore.series
}

onMounted(() => {
    moviesStore.init()
})
</script>
<template>
    <container class="py-24">
        <div v-if="moviesStore.loading">
            Carregando...
        </div>
        <div v-else>
            <section  
                v-if="getTrending(getResource()) && getTrending(getResource()).length"
                class="flex flex-col md:flex-row w-full md:space-x-2"
            >
                <div 
                    v-for="resource in getTrending(getResource())"
                    :key="resource.id"
                    class="flex w-full md:w-1/2 background-color-theme rounded-2xl shadow"
                >
                    <router-link 
                        :to="
                            { 
                                name: resource.media_type === 'movie' ? 
                                'movies.show' :
                                'series.show',
                                params: { id: resource.id, slug: convertToSlug(getResourceName(resource)) }
                            }
                        "
                        class="flex"
                    >
                        <!-- criar computed prop para alt -->
                        <img 
                            :src="`${moviesStore.POSTER_URL}${resource.backdrop_path}`"
                            class="rounded-2xl w-[300px]"
                            alt=""
                        >
                        <div class="px-4 py-5">
                            <h1 class="text-xl text-white font-bold tracking-wide">
                                {{ 'title' in resource ? resource.title : resource.name }}
                            </h1>
                            <p class="text-gray-100 pt-2">
                                {{ 
                                    resource.overview.slice(0, 80) +
                                    (resource.overview.length > 80 ? '...' : '')
                                }}
                            </p>
                            <p v-if="'release_date' in resource" class="text-gray-100 pt-2">Lançado em: {{ toLocalDate(resource.release_date) }}</p>
                        </div>
                    </router-link>
                </div>
            </section>
            <section class="w-full grid grid-cols-2 md:grid-cols-8 gap-2 pt-4">
                <div
                    v-for="genre in moviesStore.genres"
                    :key="genre.id"
                    class="rounded-xl hover:bg-slate-400 cursor-pointer shadow p-4 bg-slate-500 text-white text-bold mb-2"
                >
                    {{ genre.name }}
                </div>
            </section>
            <section class="w-full grid grid-cols-2 md:grid-cols-8 gap-2 pt-4">
                <div
                    v-for="resource in getMovies(getResource())"
                    :key="resource.id"
                    class="rounded-xl shadow mb-2"
                >
                    <router-link
                        :to="
                            { 
                                name: resource.media_type === 'movie' ? 
                                'movies.show' :
                                'series.show',
                                params: { id: resource.id, slug: convertToSlug(getResourceName(resource)) }
                            }
                        "
                    >
                        <img class="rounded-2xl" :src="`${moviesStore.POSTER_URL}${resource.poster_path}`" alt="">
                    </router-link>
                </div>
            </section>
        </div>
    </container>
</template>