import axios from "axios";
import { configHeaders, cookiesStore } from "../lib/utils.lb";
import { AppConfig } from "./endpoints";

const Axios = axios.create();

export async function apiRequest<BodyType, ResponseType>(
    params: {
      method: 'get' | 'post' | 'put' | 'patch' | 'delete';
      url?: string;
      body?: BodyType;
      baseUrl?: string;
      binaryData?:boolean
    },
  ): Promise<{ success: boolean; message?: string; data?: ResponseType }> {
    const {
      method,
      url,
      body,
      baseUrl = AppConfig.baseUrl,
      binaryData=false
    } = params;
    try {
      const response = await Axios({
        method,
        baseURL: baseUrl,
        url: url,
        headers: configHeaders(binaryData),
        data: body,
      });
      return { success: true, data: response.data };
    } catch (error) {
      let errorObj: {
        status: number | null;
        message: string;
        code?: string;
      } = {
        status: null,
        message: 'Something went wrong',
      };
      if (!axios.isAxiosError(error)) {
        errorObj = { status: null, message: 'Something went wrong' };
      } else {
        if (error.response) {
          const { data, status } = error.response ?? {};
          errorObj = {
            code: data.code,
            status: status,
            message: data?.error || 'something went wrong',
          };
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
        } else if (error.request) {
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          errorObj = {
            status: null,
            message: 'something went wrong',
          };
          console.log(
            'Axios Error:The request was made but no response was received',
            error.request
          );
        } else {
          errorObj = {
            status: null,
            message: 'something went wrong',
          };
          console.log(
            'Axios Error: Something happened in setting up the request that triggered an Error',
            error.message
          );
        }
      }
      if (errorObj?.code === 'UNAUTHORISED') {
        logoutUser();
      }
      return {
        success: false,
        message: errorObj.message,
      };
    }
  }


  export const logoutUser = () => {
    const isWindow = typeof window !== 'undefined';
    cookiesStore.deleteAll({path: '/'});
    if (isWindow) {
      window.location.href = '/'
    }
  };