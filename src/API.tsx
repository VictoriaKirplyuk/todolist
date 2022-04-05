import * as axios from "axios";

const instance = axios.default.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.0/',
    withCredentials: true,
     headers: {
         'API-KEY': 'ac6ed9cc-d092-4e25-9d0c-c69c23fe4d54'
     }
})

export const API = {
    getTodolists() {
        return instance.get('/todo-lists')
    },
    addTodolist(title: string) {
        return instance.post('/todo-lists', { title: title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete(`/todo-lists/${todolistId}`)
    }
}
