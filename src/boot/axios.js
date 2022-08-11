import { boot } from "quasar/wrappers";
import axios from "axios";

import { LocalStorage } from "quasar";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

let baseURL = "/api";

const api = axios.create({ baseURL: baseURL });

// Interceptos

api.interceptors.response.use(
  (response) => {
    // Do something with response data

    return response;
  },
  (error) => {
    // Do something with response error

    // You can even test for a response code
    // and try a new request before rejecting the promise

    if (
      error.request._hasError === true &&
      error.request._response.includes("connect")
    ) {
    }

    if (error.response.status === 401) {
      const requestConfig = error.config;

      // O token JWT expirou
      LocalStorage.clear();
      window.location.reload();

      return axios(requestConfig);
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  (config) => {
    let token = LocalStorage.getItem("token");

    if (token != null) config.headers.token = token;

    return Promise.resolve(config);
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
