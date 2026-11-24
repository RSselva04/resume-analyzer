import axios from 'axios';

// Vite proxies /api to http://127.0.0.1:8000 in development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout for AI generation
});

export const analyzeResume = async (file, jobDescription, jobTitle = '') => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('job_description', jobDescription);
  if (jobTitle) {
    formData.append('job_title', jobTitle);
  }

  const response = await client.post('/analyze/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const fetchHistory = async () => {
  const response = await client.get('/analyses/');
  return response.data;
};

export const fetchAnalysisDetail = async (id) => {
  const response = await client.get(`/analyses/${id}/`);
  return response.data;
};

export const deleteAnalysis = async (id) => {
  const response = await client.delete(`/analyses/${id}/`);
  return response.data;
};
