export function useMovies(){
    
    const convertToSlug = (name) => {
        return name
            .toLowerCase()
            .trim()
            .replace()
            .replace(/[\s\W-]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }

    const getMovies = (resource) => {
        return resource && 'results' in resource ? resource.results.slice(2) : []
    }

    const getTrending = (resource) => {
        if(resource && 'results' in resource){
            return resource.results.slice(0,2)
        }
        return null
    }

    const toLocalDate = () => {
        let day = date.split('-')[2]
        let month = date.split('-')[1]
        let year = date.split('-')[0]

        return `${day}/${month}/${year}`
    }

    return {
        getTrending,
        toLocalDate,
        getMovies,
        convertToSlug
    }
}