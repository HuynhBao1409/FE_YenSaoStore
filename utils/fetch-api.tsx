// src/utils/fetch-api.tsx
import QueryString from "qs";
import { getURL } from "./api-helpers";

export async function fetchAPI(
  path: string,
  urlParamsObject = {},
  options = {},
) {
  try {
    const mergedOptions = {
      method: 'GET',
      next: { revalidate: 60 },
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    };

    const queryString = QueryString.stringify(urlParamsObject);
    const requestUrl = `${getURL(
      `${path}${queryString ? `?${queryString}` : ""}`,
    )}`;

    const response = await fetch(requestUrl, mergedOptions);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API request failed for ${path}: ${response.status} - ${error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
}