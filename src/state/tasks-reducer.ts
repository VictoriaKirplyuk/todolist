import {AddTodolistActionType, RemoveTodolistActionType, setTodolistsActionType} from './todolists-reducer';
import {TasksStateType} from "../app/AppWithRedux";
import {ItemTaskType, tasksAPI, TaskStatuses, UpdateTaskModelType} from "../api/API";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";
import {AppActionType, setAppStatusAC, setAppTaskStatusAC} from "./app-reducer";
import {handleServerAppError} from "../error-utils";

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(t => t.id != action.taskId)
            }
        case 'ADD-TASK':
            return {
                ...state,
                //[action.todolistId]
                [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
            }
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.domainModel} : t)
            }

        case 'ADD-TODOLIST':
            return {
                ...state,
                [action.todolist.id]: []
            }

        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'SET-TASKS': {
            //написать с reduce
            const copyState = {...state}
            copyState[action.todolistId] = action.tasks
            return copyState
        }
        default:
            return state;
    }
}

//thunks
export const fetchTasksThunkAC = (todolistId: string) => (dispatch: Dispatch<ActionType | AppActionType>) => {
    dispatch(setAppTaskStatusAC('loading'))
    tasksAPI.getTasks(todolistId)
        .then(res => {
            if(res.status <= 200) {
                dispatch(setTasksAC(res.data.items, todolistId))
                dispatch(setAppTaskStatusAC('succeeded'))
            } else {
                console.log(res)
                dispatch(setAppTaskStatusAC('failed'))
            }
        })
        .catch( err => {
            console.error(err)
        })
}
export const addTaskThunkAC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionType | AppActionType>) => {
    dispatch(setAppStatusAC('loading'))
    tasksAPI.addTask(todolistId, title)
        .then(res => {
            if(res.data.resultCode === 0) {
                dispatch(addTaskAC(title, todolistId, res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch( err => {
            console.error(err)
        })
}

export const removeTaskThunkAC = (todolistId: string, taskId: string) => (dispatch: Dispatch<ActionType | AppActionType>) => {
    dispatch(setAppStatusAC('loading'))
    tasksAPI.deleteTask(todolistId, taskId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC(taskId, todolistId))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch( err => {
            console.error(err)
        })
}
export const updateTaskThunkAC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: Dispatch<ActionType | AppActionType>, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC('loading'))
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)

        if (task) {

            const apiModel: UpdateTaskModelType = {
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
                ...domainModel
            }

            tasksAPI.updateTask(todolistId, taskId, apiModel)
                .then(res => {
                    if (res.data.resultCode === 0) {
                        dispatch(updateTaskAC(taskId, apiModel, todolistId))
                        dispatch(setAppStatusAC('succeeded'))
                    } else {
                        handleServerAppError(res.data, dispatch)
                    }
                })
                .catch( err => {
                    console.error(err)
                })
        } else {
            throw new Error('ERROR! TASK IS NOT FOUND!')
        }
    }


//actions
export const removeTaskAC = (taskId: string, todolistId: string) => ({
    type: 'REMOVE-TASK',
    taskId: taskId,
    todolistId: todolistId
} as const)
export const addTaskAC = (title: string, todolistId: string, task: ItemTaskType) => ({
    type: 'ADD-TASK',
    todolistId,
    task
} as const)
export const updateTaskAC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) => ({
    type: 'UPDATE-TASK',
    domainModel,
    todolistId,
    taskId
} as const)
export const setTasksAC = (tasks: Array<ItemTaskType>, todolistId: string) => ({
    type: 'SET-TASKS',
    tasks: tasks,
    todolistId: todolistId
} as const)

//types
type UpdateDomainTaskModelType = {
    title?: string
    description?: null | string
    status?: TaskStatuses
    priority?: number
    startDate?: null | string
    deadline?: null | string
}
type ActionType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | setTodolistsActionType
    | ReturnType<typeof setTasksAC>