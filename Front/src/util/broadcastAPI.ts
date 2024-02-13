import { AxiosError } from "axios";
import { handleAxiosError } from "./articleAPI";
import API from "./axios";
import { Cookies } from "react-cookie";

export interface AnimalInfo {
  id: number;
  code: string;
  breed: string;
  age: number;
  image: string;
}

export interface BoadcastData {
  title: string;
  description: string;
  animalInfo: number[];
  sessionId: string;
  thumbnailImgUrl: string;
}

interface RequestBroadCastInterface {
  signal?: AbortSignal;
  data: BoadcastData;
}

const URL = "api/streamings";

export const requestBroadCast = async ({
  signal,
  data,
}: RequestBroadCastInterface) => {
  const cookie = new Cookies();
  const token = cookie.get("U_ID");
  try {
    const response = await API.post(URL, data, {
      signal,
      method: "POST",
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error as AxiosError);
    throw error;
  }
};

export interface CallAnimal {
  animalId: number;
  code: string;
  age: number;
  imgUrl: string;
  breed: string;
}

interface Siganl {
  signal: AbortSignal;
}
export const callAnimal = async ({ signal }: Siganl) => {
  const cookie = new Cookies();
  const token = cookie.get("U_ID");

  try {
    const response = await API.get(URL + "/animals", {
      signal,
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    return response.data as CallAnimal[];
  } catch (error) {
    handleAxiosError(error as AxiosError);
    return [];
  }
};

interface BroadcastListInterface {
  signal: AbortSignal;
}

export interface broadcastInfo {
  title: string;
  orgNickname: string;
  sessionId: string;
  thumbnailImgUrl: string;
  streamingId: number;
}

export const broadcastList = async ({ signal }: BroadcastListInterface) => {
  const cookie = new Cookies();
  const token = cookie.get("U_ID");

  try {
    const response = await API.get(URL, {
      signal,
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    return response.data as broadcastInfo[];
  } catch (error) {
    handleAxiosError(error as AxiosError);
    return [];
  }
};
