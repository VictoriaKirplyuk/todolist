import {AppActionType, setAppErrorAC, setAppStatusAC} from "./state/app-reducer";
import {Dispatch} from "redux";
import {ResponseType} from "./api/API";

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch<AppActionType>) => {
    if(data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
        dispatch(setAppStatusAC('failed'))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
}

// export const handleServerNetworkError = () => {
//
// }