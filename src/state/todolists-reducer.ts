import {FilterValuesType, TodolistDomainType} from "../app/AppWithRedux";
import {todolistAPI, TodolistType} from "../api/API";
import {Dispatch} from "redux";
import {AppActionType, setAppErrorAC, setAppStatusAC, StatusType} from "./app-reducer";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id != action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: "all", entityStatus: 'idle'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'CHANGE-TODOLIST-STATUS':
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.entityStatus} : tl)
        case "SET-TODOLISTS":
            return action.todolists.map(tl => ({...tl, filter: "all", entityStatus: 'idle'}))
        default:
            return state;
    }
}


//thunks
export const fetchTodolistsThunkAC = () => {
    return (dispatch: Dispatch<ActionsType | AppActionType>) => {
        dispatch(setAppStatusAC('loading'))
        todolistAPI.getTodolists()
            .then(res => {
                if (res.status <= 200) {
                    dispatch(setTodolistsAC(res.data))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    console.log(res)
                    dispatch(setAppStatusAC('failed'))
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
}
export const addTodolistThunkAC = (title: string) => {
    return (dispatch: Dispatch<ActionsType | AppActionType>) => {
        dispatch(setAppStatusAC('loading'))
        todolistAPI.addTodolist(title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC(title, res.data.data.item))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    if (res.data.messages.length) {
                        dispatch(setAppErrorAC(res.data.messages[0]))
                        dispatch(setAppStatusAC('failed'))
                    } else {
                        dispatch(setAppErrorAC('Some error occurred'))
                    }
                }
            })
            .catch(err => {
                console.error(err)
            })

    }
}
export const removeTodolistThunkAC = (todolistId: string) => {
    return (dispatch: Dispatch<ActionsType | AppActionType>) => {
        dispatch(setAppStatusAC('loading'))
        dispatch(changeTodolistEntityStatusAC(todolistId,'loading'))
        todolistAPI.deleteTodolist(todolistId)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTodolistAC(todolistId))
                    dispatch(setAppStatusAC('succeeded'))
                    dispatch(changeTodolistEntityStatusAC(todolistId,'succeeded'))
                } else {
                    if (res.data.messages.length) {
                        dispatch(setAppErrorAC(res.data.messages[0]))
                        dispatch(setAppStatusAC('failed'))
                        dispatch(changeTodolistEntityStatusAC(todolistId,'failed'))
                    } else {
                        dispatch(setAppErrorAC('Some error occurred'))
                    }
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
}
export const changeTodolistTitleThunkAC = (todolistId: string, title: string) => {
    return (dispatch: Dispatch<ActionsType | AppActionType>) => {
        dispatch(setAppStatusAC('loading'))
        todolistAPI.updateTodolist(todolistId, title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(changeTodolistTitleAC(todolistId, title))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    if (res.data.messages.length) {
                        dispatch(setAppErrorAC(res.data.messages[0]))
                        dispatch(setAppStatusAC('failed'))
                    } else {
                        dispatch(setAppErrorAC('Some error occurred'))
                    }
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
}

//actions
export const removeTodolistAC = (todolistId: string) => ({type: 'REMOVE-TODOLIST', id: todolistId} as const)
export const addTodolistAC = (title: string, todolist: TodolistType) => ({
    type: 'ADD-TODOLIST',
    title: title,
    todolist: todolist
} as const)
export const changeTodolistEntityStatusAC = (todolistId: string, entityStatus: StatusType) => ({
    type: 'CHANGE-TODOLIST-STATUS',
    id: todolistId,
    entityStatus: entityStatus
} as const)
export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id: id,
    title: title
} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id: id,
    filter: filter
} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({
    type: 'SET-TODOLISTS',
    todolists: todolists
} as const)

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
    | ReturnType<typeof changeTodolistEntityStatusAC>