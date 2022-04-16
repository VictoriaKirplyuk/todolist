import {FilterValuesType, TodolistDomenType} from "../AppWithRedux";
import {todolistAPI, TodolistType} from "../API";
import {Dispatch} from "redux";

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
// аналогичная запись:
// export type RemoveTodolistActionType = {
//     type: 'REMOVE-TODOLIST'
//     id: string
// }

export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
export type setTodolistsActionType = ReturnType<typeof setTodolistsAC>

type ActionsType =
    | RemoveTodolistActionType
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

export const removeTodolistAC = (todolistId: string) => {
    return {type: 'REMOVE-TODOLIST', id: todolistId} as const
}
export const addTodolistAC = (title: string, todolist: TodolistType) => {
    return {type: 'ADD-TODOLIST', title: title, todolist: todolist} as const
}
export const changeTodolistTitleAC = (id: string, title: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title} as const
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter} as const
}
export const setTodolistsAC = (todolists: Array<TodolistType>) => {
    return {type: 'SET-TODOLISTS', todolists: todolists} as const
}

