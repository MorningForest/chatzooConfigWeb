import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import Message from '@/lib/message/message';
import { isInWhiteList } from './tools';

const host = (window as any).VITE_REACT_APP_HOST || '127.0.0.1';
const port = (window as any).VITE_REACT_APP_PORT || '8000';

interface MyResponse<T> {
    msg: string;
    code?: number;
    success?: boolean;
    data: T;
}
interface MyRequest<U> extends AxiosRequestConfig {
    data?: U; // post传参
    params?: U; // get传参
}

class Http {
    timeout: number = 7000;
    // baseURL: string = "";
    baseURL: string = `http://${host}:${port}`;
    forbidMsgWhiteList: string[] = []; // 不做统一错误提示的接口白名单

    mergeOptions(options: AxiosRequestConfig) {
        return {
            timeout: this.timeout,
            baseURL: this.baseURL,
            ...options,
        };
    }

    setInterceptor(instance: AxiosInstance) {
        instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
            return config;
        });
        instance.interceptors.response.use(
            (res: AxiosResponse) => {
                const url = res?.config?.url || '';
                if (res.status === 200) {
                    const ifFail = res.data.hasOwnProperty('success') ? !res.data.success : res.data.code != 0;
                    if (ifFail) {
                        if (!isInWhiteList(url, this.forbidMsgWhiteList)) {
                            Message.error(res.data?.msg); // 注意中英文，如果要用msg，需要后台返回对应语言的msg
                        }
                        return Promise.resolve(res.data);
                    }
                    return Promise.resolve(res.data);
                }
                return Promise.resolve(res.data);
            },
            (err: AxiosError) => {
                if (!isInWhiteList(err.request.responseURL, this.forbidMsgWhiteList)) {
                    Message.warning(err?.message || '');
                }
                return Promise.resolve({
                    code: 9999,
                    data: null,
                });
            },
        );
    }

    request<U, T>(options: MyRequest<U>): Promise<MyResponse<T>> {
        const opts = this.mergeOptions(options);
        const axiosInstance: AxiosInstance = axios.create();
        this.setInterceptor(axiosInstance);
        return axiosInstance(opts);
    }

    get<U, T>(url: string, config: MyRequest<U> = {}): Promise<MyResponse<T>> {
        return this.request<U, T>({
            url,
            method: 'get',
            ...config,
        });
    }

    post<U, T>(url: string, config: MyRequest<U> = {}): Promise<MyResponse<T>> {
        return this.request<U, T>({
            url,
            method: 'post',
            ...config,
        });
    }

    put<U, T>(url: string, config: MyRequest<U> = {}): Promise<MyResponse<T>> {
        return this.request<U, T>({
            url,
            method: 'put',
            ...config,
        });
    }

    delete<U, T>(url: string, config: MyRequest<U> = {}): Promise<MyResponse<T>> {
        return this.request<U, T>({
            url,
            method: 'delete',
            ...config,
        });
    }
}

export default new Http();
