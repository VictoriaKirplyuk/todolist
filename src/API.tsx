import * as axios from "axios";
import {ItemTaskType, TodolistType} from "./ApiComponent";

const instance = axios.default.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.0/',
    withCredentials: true,
    headers: {
        'API-KEY': 'ac6ed9cc-d092-4e25-9d0c-c69c23fe4d54'
    }
})

type ResponseType<D> = {
    data: D
    messages: Array<string>
    fieldsErrors: Array<string>
    resultCode: number
}

type ResponseTaskType = {
    items: Array<ItemTaskType>
    totalCount: number
    error: null | string
}


export const todolistAPI = {
    getTodolists() {
        return instance.get<Array<TodolistType>>('/todo-lists')
    },
    addTodolist(title: string) {
        return instance.post<ResponseType<{item: TodolistType}>>('/todo-lists', {title: title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType<{item: {}}>>(`/todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType<{item: {}}>>(`/todo-lists/${todolistId}`, {title: title})
    }
}

export const tasksAPI = {
    getTasks(todolistId: string) {
        return instance.get<ResponseTaskType>(`/todo-lists/${todolistId}/tasks`)
    },
    addTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{item: ItemTaskType}>>(`/todo-lists/${todolistId}/tasks`, {title: title})
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType<{}>>(`/todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTaskTitle(todolistId: string, taskId: string, title: string) {
        return instance.put<ResponseType<{item: ItemTaskType}>>(`/todo-lists/${todolistId}/tasks/${taskId}`, {title: title})
    }
}
