import axios from "axios"

export const axiosInstant=axios.create({
    baseURL: import.meta.env.MODE==="development"?"http://localhost:8000/api/v1":"/api",
    withCredentials:true,
})