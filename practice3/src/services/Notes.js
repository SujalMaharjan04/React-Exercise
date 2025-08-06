import axios from 'axios'
const baseurl = '/api/notes';

let token = null

const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const getAll = () => {
    const request = axios.get(baseurl)
    // const newData = {
    //     content: "This note is not added to the server",
    //     important: true
    // }
    return request.then(response => response.data)
}

const create = async newObject => {
    const config = {
        headers: {Authorization: token}
    }
    const response = await axios.post(baseurl, newObject, config)
    return response.data
}

const update = (id, newObject) => {
    const request = axios.put(`${baseurl}/${id}`, newObject)
    return request.then(response => response.data)
}   

export default { getAll, create, update, setToken }
