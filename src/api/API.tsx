import * as axios from "axios";

const instance = axios.default.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1',
    withCredentials: true,
    headers: {
        'API-KEY': 'ac6ed9cc-d092-4e25-9d0c-c69c23fe4d54'
    }
})

export type UpdateDomainTaskModelType = {

}

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}

export type TasksType = {
    error: null | string
    totalCount: number
    items: Array<ItemTaskType>
}

export enum TaskStatuses {
    New = 0, //active
    InProgress = 1,
    Completed = 2, //completed
    Draft = 3
}

// export enum TodoTaskPriority {
//     Low = 0,
//     Middle = 1,
//     Hi = 2,
//     urgently = 3,
//     Later = 4
// }

export type ItemTaskType = {
    id: string
    title: string
    description: null | string
    todoListId: string
    order: number | null
    status: TaskStatuses
    priority: number
    startDate: null | string
    deadline: null | string
    addedDate: string
}

export type UpdateTaskModelType = {
    title: string
    description: null | string
    status: TaskStatuses
    priority: number
    startDate: null | string
    deadline: null | string
}

export type ResponseType<D> = {
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

export type isLoggedInType = {
    email: string,
    password: string,
    rememberMe: boolean,
    captcha?: string
}

type AuthType = {
    id: number
    email: string
    login: string
}

export const authAPI = {
    login(data: isLoggedInType) {
        return instance.post<ResponseType<{userId: number}>>('/auth/login', data)
    },
    me() {
        return instance.get<ResponseType<AuthType>>('/auth/me')
    },
    logout() {
        return instance.delete<ResponseType<{}>>('/auth/login')
    }
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
        return instance.post<ResponseType<{ item: ItemTaskType }>>(`/todo-lists/${todolistId}/tasks`, {title: title})
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType<{}>>(`/todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType<{ item: ItemTaskType }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
    }
}