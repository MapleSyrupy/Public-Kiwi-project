import axios from "axios"
const instance = axios.create({
    baseURL:"https:localhost:3000",
    useCredentials:true

})


export default instance