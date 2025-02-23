//const API_BASE_URL = "https://aktuelapi-production.up.railway.app/api";
//const API_BASE_URL_LOCAL ="http://192.168.1.74:8080/api";
const API_BASE_URL = "http://192.168.1.74:8080/api";

export const API_ENDPOINTS = {
  getAllCategories: `${API_BASE_URL}/category/getAll`,
  getAllMarks: `${API_BASE_URL}/mark/getAll`,
  getAllBrochures: `${API_BASE_URL}/brochure/getAll`,
  getBrochureById: (id) => `${API_BASE_URL}/brochure/getById/${id}`,
  getSummaryBrochureByIds: (idList) => {
    const queryString = `ids=${idList.join(',')}`;
    return `${API_BASE_URL}/brochure/getSummaryByIds?${queryString}`;
  },
  getSummaryBrochureByMarkId: (markId) => `${API_BASE_URL}/brochure/getSummaryByMarkId/${markId}`,
};

export default API_ENDPOINTS;