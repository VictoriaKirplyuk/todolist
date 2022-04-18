export type AppStateType = {
    status: StatusType
    taskStatus: StatusType
    error: ErrorType
}
export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type ErrorType = string | null

export type AppActionType =
    | ReturnType<typeof setErrorAC>
    | ReturnType<typeof setStatusAC>
    | ReturnType<typeof setTaskStatusAC>

const initialState: AppStateType = {
    status: 'idle',
    taskStatus: 'idle',
    error: null
}

export const appReducer = (state: AppStateType = initialState, action: AppActionType): AppStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-TASK-STATUS':
            return {...state, taskStatus: action.taskStatus}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        default:
            return state
    }
}

export const setStatusAC = (status: StatusType) => ({type: 'APP/SET-STATUS', status: status} as const)
export const setTaskStatusAC = (taskStatus: StatusType) => ({
    type: 'APP/SET-TASK-STATUS',
    taskStatus: taskStatus
} as const)
export const setErrorAC = (error: ErrorType) => ({type: 'APP/SET-ERROR', error: error} as const)