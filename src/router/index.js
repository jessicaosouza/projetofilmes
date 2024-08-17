import { createRouter, createWebHistory } from "vue-router"
import Home from '../pages/Home.vue'

const routes = [
    { path: '/', name: 'home', component: Home, alias: '/movies' },
    { path: '/movies/:id/:slug', name: 'movies.show', component: () => import('../components/MovieDetails.vue') },
    { path: '/series', name: 'series', component: Home },
    { path: '/series/:id/:slug', name: 'series.show', component: () => import('../components/SeriesDetails.vue') },
    { path: '/people', name: 'people', component: () => import('../pages/People.vue') }, 
    { path: '/people/:id/:slug', name: 'people.show', component: () => import('../components/PersonDetails.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router