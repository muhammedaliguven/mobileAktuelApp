const API_BASE_URL = "https://aktuelapi-production.up.railway.app/api";

export const API_ENDPOINTS = {
  getAllCategories: `${API_BASE_URL}/category/getAll`,
  getAllMarks: `${API_BASE_URL}/mark/getAll`,
  getAllBrochures: `${API_BASE_URL}/brochure/getAll`,
  getBrochureById: (id) => `${API_BASE_URL}/brochure/getById/${id}`,
  getBrochuresByMarkId: (markId) => `${API_BASE_URL}/brochure/getByMarkId/${markId}`,
};

export default API_ENDPOINTS;