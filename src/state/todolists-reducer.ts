import {FilterValuesType, TodolistDomenType} from "../AppWithRedux";
import {todolistAPI, TodolistType} from "../API";
import {Dispatch} from "redux";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST'
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST'
    title: string
    todolist: TodolistType
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE'
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER'
    id: string
    filter: FilterValuesType
}
export type setTodolistsActionType = {
    type: 'SET-TODOLISTS'
    todolists: Array<TodolistType>
}


type ActionsType = RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | setTodolistsActionType

const initialState: Array<TodolistDomenType> = []

export const todolistsReducer = (state: Array<TodolistDomenType> = initialState, action: ActionsType): Array<TodolistDomenType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id != action.id)
        }
        case 'ADD-TODOLIST': {
            const newTodolist: TodolistDomenType = {...action.todolist, title: action.title, filter: "all"}
            return [newTodolist, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                todolist.filter = action.filter;
            }
            return [...state]
        }
        case "SET-TODOLISTS": {
            return action.todolists.map(tl => {
                return {
                    ...tl,
                    filter: "all"
                }
            })
        }
        default:
            return state;
    }
}

export const fetchTodolistsThunkAC = () => {
    return (dispatch: Dispatch) => {
        todolistAPI.getTodolists()
            .then(res => dispatch(setTodolistsAC(res.data)))
    }
}
export const addTodolistThunkAC = (title: string) => {
    return (dispatch: Dispatch) => {
        todolistAPI.addTodolist(title)
            .then(res => {
                dispatch(addTodolistAC(title, res.data.data.item))
            })
    }
}
export const removeTodolistThunkAC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        todolistAPI.deleteTodolist(todolistId)
            .then(res => {
                if(res.data.resultCode === 0) {
                    dispatch(removeTodolistAC(todolistId))
                }
            })
    }
}
export const changeTodolistTitleThunkAC = (todolistId: string, title: string) => {
    return (dispatch: Dispatch) => {
        todolistAPI.updateTodolist(todolistId, title)
            .then(res => {
                if(res.data.resultCode === 0) {
                    dispatch(changeTodolistTitleAC(todolistId, title))
                }
            })
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}
export const addTodolistAC = (title: string, todolist: TodolistType): AddTodolistActionType => {
    return {type: 'ADD-TODOLIST', title: title, todolist: todolist}
}
export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title}
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter}
}
export const setTodolistsAC = (todolists: Array<TodolistType>): setTodolistsActionType => {
    return {type: 'SET-TODOLISTS', todolists: todolists}
}

