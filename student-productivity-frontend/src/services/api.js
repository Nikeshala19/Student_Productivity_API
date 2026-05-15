import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// Goals
export const getGoals = () => axios.get(`${BASE_URL}/goals`);
export const getGoalById = (id) => axios.get(`${BASE_URL}/goals/${id}`);
export const createGoal = (data) => axios.post(`${BASE_URL}/goals`, data);
export const updateGoal = (id, data) => axios.put(`${BASE_URL}/goals/${id}`, data);
export const deleteGoal = (id) => axios.delete(`${BASE_URL}/goals/${id}`);

// Tasks
export const getTasks = () => axios.get(`${BASE_URL}/tasks`);
export const getTasksByGoal = (goalId) => axios.get(`${BASE_URL}/tasks/goal/${goalId}`);
export const createTask = (data) => axios.post(`${BASE_URL}/tasks`, data);
export const updateTask = (id, data) => axios.put(`${BASE_URL}/tasks/${id}`, data);
export const markComplete = (id) => axios.patch(`${BASE_URL}/tasks/${id}/complete`);
export const deleteTask = (id) => axios.delete(`${BASE_URL}/tasks/${id}`);

// Sessions
export const getSessions = () => axios.get(`${BASE_URL}/sessions`);
export const getSessionsByGoal = (goalId) => axios.get(`${BASE_URL}/sessions/goal/${goalId}`);
export const createSession = (data) => axios.post(`${BASE_URL}/sessions`, data);
export const updateSession = (id, data) => axios.put(`${BASE_URL}/sessions/${id}`, data);
export const deleteSession = (id) => axios.delete(`${BASE_URL}/sessions/${id}`);