// src/services/apiService.ts
import { API_ENDPOINTS } from "../constants/api";

// Get banners
export const getBanners = async () => {
    const res = await fetch(API_ENDPOINTS.BANNERS);
    const data = await res.json();
    return data;
};

// Get categories
export const getCategories = async () => {
    const res = await fetch(API_ENDPOINTS.CATEGORIES);
    const data = await res.json();
    return data;
};

// Get article summary (highlighted, hot_news, latest_per_category)
export const getArticlesSummary = async () => {
    const res = await fetch(API_ENDPOINTS.ARTICLES_SUMMARY);
    const data = await res.json();
    return data; // Bạn có thể `console.log(data)` để xem cấu trúc
};
