import axios from "axios";

const api = axios.create({
  baseURL: "https://api.themagicmonks.com/wp-json/wp/v2",
});

export default api;