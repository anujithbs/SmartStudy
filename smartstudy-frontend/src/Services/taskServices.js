import axios from 'axios';

const API_URL = 'http://localhost:8080/tasks';

export function getTasks(){
    return axios.get(API_URL);
}

export function createTask(taskData){
    return axios.post(API_URL, taskData);
}

export function updateTask(taskId, taskData){
    return axios.put(`${API_URL}/${taskId}`, taskData);
    
}

export function deleteTask(taskId){
    return axios.delete(`${API_URL}/${taskId}`);
}