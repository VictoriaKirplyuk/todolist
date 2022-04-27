import {Dispatch} from "redux";
import {authAPI} from "../api/API";
import {LoginActionType, setIsLoggedInAC} from "./login-reducer";

const initialState: AppStateType = {
    appStatus: 'idle',
    appTaskStatus: 'idle',
    appError: null,
    initialization: false
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
            return {...state, initialization: action.initialization}
        default:
            return state
    }
}


//thunks
export const setInitializationTC = () => (dispatch: Dispatch<LoginActionType | AppActionType>) => {
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setInitializationAC(true))
            } else {
                dispatch(setInitializationAC(true))
            }
        })
        .catch(err => console.log(err))
}

//actions
export const setAppStatusAC = (appStatus: StatusType) => ({type: 'APP/SET-STATUS', appStatus: appStatus} as const)
export const setAppTaskStatusAC = (appTaskStatus: StatusType) => ({
    type: 'APP/SET-TASK-STATUS',
    appTaskStatus: appTaskStatus
} as const)
export const setAppErrorAC = (appError: AppErrorType) => ({type: 'APP/SET-ERROR', appError: appError} as const)
export const setInitializationAC = (initialization: boolean) => ({type: 'APP/IS-AUTH', initialization: initialization} as const)

//types
export type AppStateType = {
    appStatus: StatusType
    appTaskStatus: StatusType
    appError: AppErrorType
    initialization: boolean
}
export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppErrorType = string | null

export type AppActionType =
    | ReturnType<typeof setAppErrorAC>
    | ReturnType<typeof setAppStatusAC>
    | ReturnType<typeof setAppTaskStatusAC>
    | ReturnType<typeof setInitializationAC>