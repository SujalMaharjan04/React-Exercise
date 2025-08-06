import axios from 'axios'
const baseurl = '/api/login'

const login = async (credential) => {
    const result = await axios.post(baseurl, credential)
    return result.data
}

export default {login}