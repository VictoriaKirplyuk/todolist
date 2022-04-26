export type AppStateType = {
    appStatus: StatusType
    appTaskStatus: StatusType
    appError: AppErrorType
    isAuth: boolean
}
export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppErrorType = string | null

export type AppActionType =
    | ReturnType<typeof setAppErrorAC>
    | ReturnType<typeof setAppStatusAC>
    | ReturnType<typeof setAppTaskStatusAC>
    | ReturnType<typeof setIsAuth>

const initialState: AppStateType = {
    appStatus: 'idle',
    appTaskStatus: 'idle',
    appError: null,
    isAuth: false
}

export const appReducer = (state: AppStateType = initialState, action: AppActionType): AppStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, appStatus: action.appStatus}
        case 'APP/SET-TASK-STATUS':
            return {...state, appTaskStatus: action.appTaskStatus}
        case 'APP/SET-ERROR':
            return {...state, appError: action.appError}
        case 'APP/IS-AUTH':
            return {...state, isAuth: action.isAuth}
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
export const setIsAuth = (isAuth: boolean) => ({type: 'APP/IS-AUTH', isAuth: isAuth} as const)