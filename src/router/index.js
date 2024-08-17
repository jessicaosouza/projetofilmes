import { createRouter, createWebHistory } from "vue-router"
import Home from '../pages/Home.vue'

const routes = [
    { path: '/login', name: 'login', component: () => import('../pages/Login.vue') },
    { path: '/', name: 'home', component: Home, alias: '/movies' },
    { 
        path: '/dashboard', 
        name: 'dashboard', 
        component: () => import('../pages/Dashboard.vue'),
        meta: {
            requiredAuth: true
        }
    },
    { path: '/movies/:id/:slug', name: 'movies.show', component: () => import('../components/MovieDetails.vue') },
    { path: '/series', name: 'series', component: Home },
    { path: '/series/:id/:slug', name: 'series.show', component: () => import('../components/SeriesDetails.vue') },
    { path: '/people', name: 'people', component: () => import('../pages/People.vue') }, 
    { 
        path: '/people/:id/:slug', 
        name: 'people.show', 
        component: () => import('../components/PersonDetails.vue'),
        // beforeEnter: async (to, from, next) => {
            // if(true){
            //     next()
            // }
            // next({ name: 'NotFound' })

            // return {
            //     name: 'NotFound',
            //     params: { pathMatch: to.path.split('/').slice(1) },
            //     query: to.query,
            //     hash: to.hash
            // }
        // }
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../pages/NotFound.vue') }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'link-ativo'
})

router.beforeEach((to, from) => {
    if(to.meta.requiredAuth && !window.user){
        return { name: 'login', query: { redirect: to.name } }
    }
})

export default router