import {Dispatch} from "redux";
import {authAPI, isLoggedInType} from "../api/API";

type loginStateType= {
    isLoggedIn: boolean
}

const initialState: loginStateType = {
    isLoggedIn: false
}

type LoginActionType = ReturnType<typeof setIsLoggedInAC>

export const loginReducer = (state: loginStateType = initialState, action: LoginActionType): loginStateType => {
    switch (action.type) {
        case 'APP/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}

export const setIsLoggedInAC = (value: boolean) => ({type: 'APP/SET-IS-LOGGED-IN', value: value} as const)
export const setIsLoggedInThunkAC = (values: isLoggedInType) => (dispatch: Dispatch) => {
    authAPI.login(values)
        .then( res => {
            if(res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
            }
        })
}