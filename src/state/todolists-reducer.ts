import {FilterValuesType, TodolistDomenType} from "../app/AppWithRedux";
import {todolistAPI, TodolistType} from "../api/API";
import {Dispatch} from "redux";
import {AppActionType, setErrorAC, setStatusAC} from "./app-reducer";

const initialState: Array<TodolistDomenType> = []

export const todolistsReducer = (state: Array<TodolistDomenType> = initialState, action: ActionsType): Array<TodolistDomenType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id != action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: "all"}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)

        case "SET-TODOLISTS":
            return action.todolists.map(tl => ({...tl, filter: "all"}))
        default:
            return state;
    }
}


//thunks
export const fetchTodolistsThunkAC = () => {
    return (dispatch: Dispatch<ActionsType | AppActionType>) => {
        dispatch(setStatusAC('loading'))
        todolistAPI.getTodolists()
            .then(res => {
                if(res.status <= 200) {
                    dispatch(setTodolistsAC(res.data))
                    dispatch(setStatusAC('succeeded'))
                } else {
                    console.log(res)
                    dispatch(setStatusAC('failed'))
                }
            })
    }
}
export const addTodolistThunkAC = (title: string) => {
    return (dispatch: Dispatch<ActionsType | AppActionType >) => {
        dispatch(setStatusAC('loading'))
        todolistAPI.addTodolist(title)
            .then(res => {
                if(res.data.resultCode === 0) {
                    dispatch(addTodolistAC(title, res.data.data.item))
                    dispatch(setStatusAC('succeeded'))
                } else {
                    dispatch(setErrorAC(res.data.messages[0]))
                    dispatch(setStatusAC('failed'))
                }
            })
    }
}
export const removeTodolistThunkAC = (todolistId: string) => {
    return (dispatch: Dispatch<ActionsType | AppActionType>) => {
        dispatch(setStatusAC('loading'))
        todolistAPI.deleteTodolist(todolistId)
            .then(res => {
                if(res.data.resultCode === 0) {
                    dispatch(removeTodolistAC(todolistId))
                    dispatch(setStatusAC('succeeded'))
                } else {
                    dispatch(setErrorAC(res.data.messages[0]))
                    dispatch(setStatusAC('failed'))
                }
            })
    }
}
export const changeTodolistTitleThunkAC = (todolistId: string, title: string) => {
    return (dispatch: Dispatch<ActionsType | AppActionType>) => {
        dispatch(setStatusAC('loading'))
        todolistAPI.updateTodolist(todolistId, title)
            .then(res => {
                if(res.data.resultCode === 0) {
                    dispatch(changeTodolistTitleAC(todolistId, title))
                    dispatch(setStatusAC('succeeded'))
                } else {
                    dispatch(setErrorAC(res.data.messages[0]))
                    dispatch(setStatusAC('failed'))
                }
            })
    }
}

//actions
export const removeTodolistAC = (todolistId: string) => ({type: 'REMOVE-TODOLIST', id: todolistId} as const)
export const addTodolistAC = (title: string, todolist: TodolistType) => ({type: 'ADD-TODOLIST', title: title, todolist: todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) => ({type: 'CHANGE-TODOLIST-TITLE', id: id, title: title} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists: todolists} as const)

//types
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
// аналогичная запись:
// export type RemoveTodolistActionType = {
//     type: 'REMOVE-TODOLIST'
//     id: string
// }
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type setTodolistsActionType = ReturnType<typeof setTodolistsAC>
type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | setTodolistsActionType