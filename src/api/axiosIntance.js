import axios from "axios";

const apiAccessPoint = {
  local: 'https://localhost:7084/api'
  // online: 'https://brentexpensetracker.runasp.net/api'

};

const getCurrentToken = () => localStorage.getItem("token");

// Create the Axios instance
const axiosInstance = axios.create({
  baseURL: apiAccessPoint.local
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCurrentToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;