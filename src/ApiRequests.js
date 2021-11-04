import axios from "axios";
// import { getTimezone, getToken } from "utils";

/***
 *
 * All token related variables have been commented.
 * If you wish to use authorization pls uncomment the inclusion of ViaAuth
 */
const BASE_URL = process.env.REACT_APP_TOPMATE_DOMAIN_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Accept-Language": "en",
  },
});

const getConfig = (params, extraConfigs) => {
  let config = {
    params: params,
  };

  // const token = getToken();

  // if (extraConfigs && extraConfigs.viaOauth) {
  //   config = {
  //     ...config,
  //     headers: { Authorization: `Token ${extraConfigs?.token || token}` },
  //   };
  // }
  if (extraConfigs && extraConfigs.withCredentials) {
    config = {
      ...config,
      //  withCredentials: true,
    };
  }
  config = {
    ...config,
    headers: {
      ...config?.headers,
    },
  };
  return config;
};

// extraconfigs  = {viaAuth, withCredentials}
const axiosRequest = (apiKey, method, dataObj, extraConfigs) => {
  const methods = method.toLowerCase();
  if (methods === "get" || methods === "delete" || methods === "head") {
    let params = {};
    params = dataObj ? dataObj : params;
    const config = getConfig(params, extraConfigs);

    return axiosInstance[methods](apiKey, config);
  } else if (methods === "post" || methods === "put" || methods === "patch") {
    let params = {};
    params = dataObj ? dataObj : params;
    let config = getConfig(params, extraConfigs);
    return axiosInstance[methods](apiKey, { ...params }, config);
  } else {
    return Promise.reject("Invalid method");
  }
};

export const post = async (apiKey, params, extraConfigs) => {
  const response =
    apiKey && (await axiosRequest(apiKey, "post", params, extraConfigs));
  return response;
};

export const patch = async (apiKey, params, extraConfigs) => {
  const response =
    apiKey && (await axiosRequest(apiKey, "patch", params, extraConfigs));
  return response;
};

export const get = async (apiKey, params, extraConfigs) => {
  const response =
    apiKey && (await axiosRequest(apiKey, "get", params, extraConfigs));
  return response;
};

export const del = async (apiKey, params, extraConfigs) => {
  const response =
    apiKey && (await axiosRequest(apiKey, "delete", params, extraConfigs));
  return response;
};

export const put = async (apiKey, params, extraConfigs) => {
  const response =
    apiKey && (await axiosRequest(apiKey, "put", params, extraConfigs));
  return response;
};
