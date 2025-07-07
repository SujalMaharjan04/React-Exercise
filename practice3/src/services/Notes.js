import axios from 'axios'
const baseurl = '/api/notes';

const getAll = () => {
    const request = axios.get(baseurl)
    // const newData = {
    //     content: "This note is not added to the server",
    //     important: true
    // }
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseurl, newObject)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${baseurl}/${id}`, newObject)
    return request.then(response => response.data)
}   

export default { getAll, create, update }
