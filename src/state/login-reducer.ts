import {Dispatch} from "redux";
import {authAPI, isLoggedInType} from "../api/API";
import {AppActionType} from "./app-reducer";
import {handleServerAppError} from "../error-utils";

const initialState: loginStateType = {
    isLoggedIn: false
}

export const loginReducer = (state: loginStateType = initialState, action: LoginActionType): loginStateType => {
    switch (action.type) {
        case 'APP/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}

//thunks
export const setIsLoggedInTC = (values: isLoggedInType) => (dispatch: Dispatch<LoginActionType | AppActionType>) => {
    authAPI.login(values)
        .then( res => {
            if(res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch( err => {
            console.error(err)
        })
}

//actions
export const setIsLoggedInAC = (value: boolean) => ({type: 'APP/SET-IS-LOGGED-IN', value: value} as const)

//types
export type loginStateType= {
    isLoggedIn: boolean
}

export type LoginActionType = ReturnType<typeof setIsLoggedInAC>