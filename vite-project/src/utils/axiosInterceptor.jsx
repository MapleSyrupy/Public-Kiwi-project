import axios from "axios";
import { useNavigate } from "react-router-dom";

export default axios.interceptors.response.use(
    response=>response,
    error=>{
        if(error.response.status === 404){
            console.log(error)
           return useNavigate("/error",{error})
        }
    }

)