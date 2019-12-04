import axios, { AxiosResponse } from "axios";
import { IActivity } from './../models/activity';

axios.defaults.baseURL = "http://localhost:5000/api";

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) =>
    new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));

const requests = {
    get: async (url: string) => {
        sleep(1000);
        return responseBody(await axios.get(url));
    },
    post: async (url: string, body: {}) => {
        sleep(1000);
        return responseBody(await axios.post(url, body));
    },
    put: async (url: string, body: {}) => {
        sleep(1000);
        return responseBody(await axios.put(url, body));
    },
    delete: async (url: string) => {
        sleep(1000);
        return responseBody(await axios.delete(url));
    }
};

const Activities = {
    list: (): Promise<IActivity[]> => requests.get('/activities'),
    details: (id: string): Promise<IActivity> => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post("/activities", activity),
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete(`/activities/${id}`)
}

export default {
    Activities
}