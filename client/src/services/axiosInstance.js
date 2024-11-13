import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

let accessToken = "";

function setAccessToken(newToken) {
  accessToken = newToken;
}

axiosInstance.interceptors.request.use((config) => {
  config.withCredentials = true;
  if (!config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    const prevReq = error.config;
    if (error.response.status === 403) {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_API
        }/token/refresh`,
        { withCredentials: true }
      );
      accessToken = response.data.accessToken;
      prevReq.sent = true;
      prevReq.headers.Authorization = `Bearer ${accessToken}`;
      return axiosInstance(prevReq);
    }
  }
);

export { setAccessToken };

export default axiosInstance;
