export type AppStateType = {
    appStatus: StatusType
    appTaskStatus: StatusType
    appError: AppErrorType
}
export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppErrorType = string | null

export type AppActionType =
    | ReturnType<typeof setAppErrorAC>
    | ReturnType<typeof setAppStatusAC>
    | ReturnType<typeof setAppTaskStatusAC>

const initialState: AppStateType = {
    appStatus: 'idle',
    appTaskStatus: 'idle',
    appError: null
}

export const appReducer = (state: AppStateType = initialState, action: AppActionType): AppStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, appStatus: action.appStatus}
        case 'APP/SET-TASK-STATUS':
            return {...state, appTaskStatus: action.appTaskStatus}
        case 'APP/SET-ERROR':
            return {...state, appError: action.appError}
        default:
            return state
    }
}

export const setAppStatusAC = (appStatus: StatusType) => ({type: 'APP/SET-STATUS', appStatus: appStatus} as const)
export const setAppTaskStatusAC = (appTaskStatus: StatusType) => ({
    type: 'APP/SET-TASK-STATUS',
    appTaskStatus: appTaskStatus
} as const)
export const setAppErrorAC = (appError: AppErrorType) => ({type: 'APP/SET-ERROR', appError: appError} as const)