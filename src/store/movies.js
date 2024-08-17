import { defineStore } from "pinia"
import { ref, toRaw } from 'vue'
import axios from 'axios'

export const useMoviesStore = defineStore('movies', () => {
    const MOVIES_DB_KEY = import.meta.env.VITE_TMDB_SECRET
    const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL
    const POSTER_URL = import.meta.env.VITE_TMDB_POSTER_URL
    const db = ref(null)
    const errors = ref([])
    const loading = ref(true)
    const movies = ref(null)
    const series = ref(null)
    const genres = ref(null)
    const people = ref(null)
    const options = {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${MOVIES_DB_KEY}`
        }
    }

    const openDatabase = async () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('moviesdb', 1)

            request.onupgradeneeded = function(event) {
                const db = event.target.result

                if(!db.objectStoreNames.contains('genres')){
                    db.createObjectStore('genres', { keyPath:  'id'})
                }

                if(!db.objectStoreNames.contains('movies')){
                    db.createObjectStore('movies', { keyPath:  'id'})
                }

                if(!db.objectStoreNames.contains('series')){
                    db.createObjectStore('series', { keyPath:  'id'})
                }
                
                if(!db.objectStoreNames.contains('people')){
                    db.createObjectStore('people', { keyPath:  'id'})
                }
                
                if(!db.objectStoreNames.contains('manager')){
                    const managerStore = db.createObjectStore('manager', { keyPath:  'id'})
                    managerStore.createIndex('table', 'table', { unique: true })
                }
            }

            request.onsuccess = function(event){
                resolve(event.target.result)
            }

            request.onerror = function(event){
                errors.value.push('Erro carregar dados')
                reject('Error ao abrir o banco de dados: ',  + event.target.errorCode)
            }
        })
    }

    const checkAndUpdateTable = (tableName, fetchApi, stateRef) => {
        return new Promise((resolve, reject) => {
            const transaction = db.value.transaction(['manager'], 'readwrite')
            const managerStore = transaction.objectStore('manager')
            const request = managerStore.index('table').get(tableName)

            request.onsuccess = async function(event){
                const record = event.target.result
                const now = Math.floor(Date.now() / 1000) // unix timestamp em sec

                if(!record || now - record.last_updated > 3600 ){
                    await fetchApi(db)
                    const newRecord = {
                        id: record ? record.id : crypto.randomUUID(),
                        table: tableName,
                        last_updated: now
                    }

                    managerStore.put(newRecord)
                }else{
                    stateRef.value = await fetchFromTable(tableName)
                }
                resolve()
            }

            request.onerror = function (event){
                errors.value.push('Erro ao carregar dados')
                reject('Error ao verificar a table manger: ',  + event.target.errorCode)
            }
        })
    }

    const fetchFromTable = (tableName) => {
        return new Promise((resolve, reject) => {
            const transaction = db.value.transaction([tableName], 'readonly')
            const store = transaction.objectStore(tableName)

            if(tableName === 'genres') {
                const request = store.getAll()

                request.onsuccess = function(event){
                    resolve(event.target.result)
                }

                request.onerror = function(event){
                    errors.value.push('Erro ao buscar gêneros')
                    reject('Erro ao buscar gêneros: ', event.target.errorCode)
                }
            }else{
                const request = store.openCursor()
                
                request.onsuccess = function(event){
                    const cursor = event.target.result
                    if(cursor){
                        resolve(cursor.value)
                    }{
                        resolve(null)
                    }
                }

                request.onerror = function(event){
                    errors.value.push(`Erro ao buscar ${tableName}`)
                    reject(`Erro ao buscar ${tableName}`, event.target.errorCode)
                }
            }
        })
    }

    const getGenres = async () => {
        axios.get(`${BASE_URL}genre/movie/list?language=pt-BR`, options)
        .then(response => {
            genres.value = response.data.genres
            const transaction = db.value.transaction(['genres'], 'readwrite')
            const store = transaction.objectStore('genres')
            toRaw(genres.value).forEach(genre => {
                store.put(genre)
            })
        })
    }

    const getTrendingMovies = async () => {
        axios.get(`${BASE_URL}trending/movie/day?language=pt-BR`, options)
        .then(response => {
            movies.value = response.data
            const transaction = db.value.transaction(['movies'], 'readwrite')
            const store = transaction.objectStore('movies')
            movies.value.id = crypto.randomUUID()
            store.put(toRaw(movies.value))
        })
    }

    const getTrendingSeries = async () => {
        axios.get(`${BASE_URL}trending/tv/day?language=pt-BR`, options)
        .then(response => {
            series.value = response.data
            const transaction = db.value.transaction(['series'], 'readwrite')
            const store = transaction.objectStore('series')
            series.value.id = crypto.randomUUID()
            store.put(toRaw(series.value))
        })
    }

    const getTrendingPeople = async () => {
        axios.get(`${BASE_URL}trending/person/day?language=pt-BR`, options)
        .then(response => {
            people.value = response.data
            const transaction = db.value.transaction(['people'], 'readwrite')
            const store = transaction.objectStore('people')
            people.value.id = crypto.randomUUID()
            store.put(toRaw(people.value))
        })
    }

    const init = async () => {
        loading.value = true
        db.value = await openDatabase()

        await checkAndUpdateTable('genres', getGenres, genres)
        await checkAndUpdateTable('movies', getTrendingMovies, movies)
        await checkAndUpdateTable('people', getTrendingPeople, people)
        await checkAndUpdateTable('series', getTrendingSeries, series)
        loading.value = false
        // db.value.close()
    }

    return {
        errors,
        init,
        loading,
        movies,
        genres,
        people,
        series,
        options,
        POSTER_URL,
        BASE_URL
    }
})