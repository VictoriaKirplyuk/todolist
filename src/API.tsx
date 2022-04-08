import * as axios from "axios";

const instance = axios.default.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.0/',
    withCredentials: true,
    headers: {
        'API-KEY': 'ac6ed9cc-d092-4e25-9d0c-c69c23fe4d54'
    }
})

export const todolistAPI = {
    getTodolists() {
        return instance.get('/todo-lists')
    },
    addTodolist(title: string) {
        return instance.post('/todo-lists', {title: title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete(`/todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put(`/todo-lists/${todolistId}`, {title: title})
    }
}

export const tasksAPI = {
    getTasks(todolistId: string) {
        return instance.get(`/todo-lists/${todolistId}/tasks`)
    },
    addTask(todolistId: string, title: string) {
        return instance.post(`/todo-lists/${todolistId}/tasks`, {title: title})
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete(`/todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTaskTitle(todolistId: string, taskId: string, title: string) {
        return instance.put(`/todo-lists/${todolistId}/tasks/${taskId}`, {title: title})
    }
}
