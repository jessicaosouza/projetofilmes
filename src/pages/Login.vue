<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'

const username = ref('')
const router = useRouter()
const route = useRoute()

const submit = () => {
    window.user = username.value
    const redirect_route = route.query.redirect || 'movies'    
    router.push({ name: redirect_route })
}
</script>
<template>
    <div class="max-w-xl h-screen w-screen mx-auto bg-white flex items-center justify-center">
        <form @submit.prevent="submit()" class="shadow bg-slate-400 rounded-lg flex flex-col p-10">
            <label for="user">Nome</label>
            <input type="text" v-model="username" name="user" />
            <button type="submit">
                Entrar
            </button>
        </form>
    </div>
</template>