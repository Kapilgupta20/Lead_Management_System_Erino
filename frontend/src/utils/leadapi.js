import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

const serializeFilters = (filters = {}) => {
  const query = {};
  Object.entries(filters).forEach(([field, filter]) => {
    if (!filter || !filter.op || filter.value === undefined || filter.value === "") return;
    switch (field) {
      case "email":
      case "company":
      case "city":
        if (filter.op === "eq") query[`${field}_eq`] = filter.value;
        else if (filter.op === "contains") query[`${field}_contains`] = filter.value;
        break;
      
      case "status":
      case "source":
        if (filter.op === "eq") query[`${field}_eq`] = filter.value;
        else if (filter.op === "in" && Array.isArray(filter.value) && filter.value.length)
          query[`${field}_in`] = filter.value.join(",");
        break;
      
      case "score":
      case "lead_value":
        if (filter.op === "eq") query[`${field}_eq`] = filter.value;
        else if (filter.op === "gt") query[`${field}_gt`] = filter.value;
        else if (filter.op === "lt") query[`${field}_lt`] = filter.value;
        else if (filter.op === "between" && filter.value !== undefined && filter.value2 !== undefined)
          query[`${field}_between`] = `${filter.value},${filter.value2}`;
        break;
      
      case "created_at":
      case "last_activity_at":
        if (filter.op === "on") query[`${field}_on`] = filter.value;
        else if (filter.op === "before") query[`${field}_before`] = filter.value;
        else if (filter.op === "after") query[`${field}_after`] = filter.value;
        else if (filter.op === "between" && filter.value && filter.value2)
          query[`${field}_between`] = `${filter.value},${filter.value2}`;
        break;
      
      case "is_qualified":
        if (filter.op === "eq") query[`${field}_eq`] = filter.value;
        break;
      default:
        break;
    }
  });
  return query;
};

export const getLeads = async (params = {}) => {
  const { page, limit, sort, ...filters } = params;
  const query = {
    ...(page && { page }),
    ...(limit && { limit }),
    ...(sort && { sort }),
    ...serializeFilters(filters)
  };
  const response = await api.get('/leads', { params: query });
  return response.data;
};

export const getLead = async (id) => {
  const response = await api.get(`/leads/${id}`);
  return response.data;
};

export const createLead = async (leadData) => {
  const response = await api.post('/leads', leadData);
  return response.data;
};

export const updateLead = async (id, updates) => {
  const response = await api.put(`/leads/${id}`, updates);
  return response.data;
};

export const deleteLead = async (id) => {
  const response = await api.delete(`/leads/${id}`);
  return response.data;
};