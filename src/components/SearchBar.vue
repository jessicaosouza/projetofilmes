<script setup>
import { Search } from 'lucide-vue-next'
import { useMoviesStore } from '../store/movies'
import { useMovies } from '../composables'
import { onMounted, ref } from 'vue'
import axios from 'axios'
import debounce from 'lodash/debounce'

const { convertToSlug, getResourceName } = useMovies()
const moviesStore = useMoviesStore()
const search_query = ref('')
const show_search_input = ref(false)
const search_results = ref([])
const loading = ref(false)

const searchCatalog = debounce(
    async function(){
        if(search_query.value.length <= 0){ return }
        loading.value = true
        axios.get(`${moviesStore.BASE_URL}search/multi?query=${search_query.value}&language=pt-BR`, moviesStore.options)
        .then(response => {
            search_results.value = response.data.results
        })
        .catch(error => {
            alert("Erro ao buscar resource")
            console.log(error)
        })
        .finally(() => loading.value = false)
    },
    400
)

const closeSearch = () => {
    search_query.value = ''
    search_results.value = []
    show_search_input.value = false
}

const getRouteName = (resource) => {
    let type = resource.media_type
    switch (type) {
        case 'movie':
            return 'movies.show'
        case 'tv':
            return 'series.show'
        case 'person':
            return 'people.show'
    }
}

onMounted(() => {
    document.addEventListener('click', (e) => {
        if(!e.target.closest('.search_bar')){
            closeSearch()
        }
    })
})

</script>
<template>
    <div class="relative search_bar">
        <!-- converter os links para componentes -->
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
            <li @mouseover="show_search_input = true" class="text-white py-2 px-4 cursor-pointer">
                <search class="size-5" />
            </li>
        </ul>
        <div v-if="show_search_input" class="rounded-full absolute w-full md:w-[500px] right-0">
            <input 
                type="text" 
                @input="searchCatalog()"  
                @keydown.esc="closeSearch" 
                v-model="search_query" 
                class="w-full rounded-full ring-black py-2 px-4 z-10" 
                :class="{'cursor-wait': loading}"
            />
        </div>
        <ul 
            v-if="search_results.length"
            class="absolute mt-10 rounded-lg right-0 w-full md:w-[500px] bg-white text-gray-800"
        >
            <li
                v-for="resource in search_results"
                :key="resource.id"
                class="px-4 py-2 flex hover:bg-gray-100 hover:rounded-lg cursor-pointer "
            >
                <router-link 
                    :to="{ name: getRouteName(resource), params: { id: resource.id, slug: convertToSlug(getResourceName(resource)) } }" 
                    class="flex items-center space-x-2"
                >
                    <p>{{'title' in resource ? resource.title : resource.name }}</p>
                    <p v-if="resource.media_type === 'movie'" class="text-xs">(filme)</p>
                    <p v-if="resource.media_type === 'tv'" class="text-xs">(série)</p>
                    <p v-if="resource.media_type === 'person'" class="text-xs">
                        {{ resource.gender === 0 ? '(ator)' : '(atriz)' }}
                    </p>
                </router-link>
            </li>
        </ul>
    </div>
</template>