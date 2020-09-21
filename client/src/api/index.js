import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/modernWrap'
})

// giftRequests
export const createGiftRequest = payload => api.post('/createGiftRequest', payload)
export const getGiftRequest = id => api.get('/getGiftRequest?id=' + id)
export const getGiftRequests = () => api.get('/getGiftRequests')
export const deleteGiftRequest = id => api.get('/deleteGiftRequest?id=' + id)

// Clue
export const createClue = payload => api.post('/createClue', payload)
export const getClue = id => api.get('/getClue?id=' + id)
export const getClues = () => api.get('/getClues')
export const deleteClue = id => api.get('/deleteClue?id=' + id)
export const updateClue = id => api.get('/updateClue?id=' + id)

const apis = {
    createGiftRequest,
    getGiftRequest,
    getGiftRequests,
    deleteGiftRequest,
    createClue,
    getClue,
    getClues,
    deleteClue,
    updateClue
}

export default apis